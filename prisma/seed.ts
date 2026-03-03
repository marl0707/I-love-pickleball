import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const PRODUCTION_DIR = path.join(__dirname, '..', 'production_data');

function loadJSON(subDir: string, fileName: string): any {
  const filePath = path.join(PRODUCTION_DIR, subDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ ファイルが見つかりません: ${subDir}/${fileName}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`⚠️ JSONパースエラー: ${subDir}/${fileName}`);
    return null;
  }
}

function toBool(val: any): boolean {
  if (val === true || val === 1 || val === '1' || val === 'true') return true;
  return false;
}

function toFloat(val: any): number | null {
  if (val == null) return null;
  const num = parseFloat(String(val));
  return isNaN(num) ? null : num;
}

function toInt(val: any): number | null {
  if (val == null) return null;
  const num = parseInt(String(val), 10);
  return isNaN(num) ? null : num;
}

async function cleanDatabase() {
  console.log('🗑️ 既存データをすべて削除しています...');
  const models = [
    'mediaItem', 'eventParticipant', 'event', 'communityComment', 'communityPost',
    'communityCategory', 'community', 'drillBookmark', 'drill', 'bookmark', 'article',
    'proPlayer', 'gearReview', 'gearBag', 'gearApparel', 'gearBall', 'gearShoe',
    'gearPaddle', 'gearAccessory', 'facilityReview', 'facilityShop', 'facilityCourt',
    'facility', 'adBid', 'advertisement', 'user', 'brand', 'tag', 'association',
    'coach', 'injuryPrevention', 'award', 'advancedShot', 'mlpTeam',
    'certification', 'pbApp', 'promotion', 'priceGuide', 'glossaryTerm', 'expertReview'
  ];
  for (const model of models) {
    if ((prisma as any)[model]) {
      await (prisma as any)[model].deleteMany();
    }
  }
  console.log('✅ 削除完了');
}

async function seedMasterData() {
  // Brands
  const brands = loadJSON('supplementary', 'brands.json');
  let bCount = 0;
  if (brands && Array.isArray(brands)) {
    for (const item of brands) {
      await prisma.brand.create({
        data: {
          name: item.name || 'Unknown',
          description: item.description || null,
          countryOfOrigin: item.country_of_origin || null,
          websiteUrl: item.website_url || null,
        }
      });
      bCount++;
    }
  }
  console.log(`✅ ブランド: ${bCount}件`);

  // Tags
  const tags = loadJSON('supplementary', 'master_tags.json');
  let tCount = 0;
  if (tags && Array.isArray(tags)) {
    for (const item of tags) {
      await prisma.tag.create({
        data: {
          name: item.name || item.tag_name || `tag-${Date.now()}-${tCount}`,
          category: item.category || null,
        }
      }).catch(() => { });
      tCount++;
    }
  }
  console.log(`✅ タグ: ${tCount}件`);

  // Glossary
  const glossary = loadJSON('content', 'glossary.json');
  let gCount = 0;
  if (glossary && Array.isArray(glossary)) {
    for (const item of glossary) {
      await prisma.glossaryTerm.create({
        data: {
          termEn: item.term_en || 'Unknown',
          termJa: item.term_ja || 'Unknown',
          description: item.description || '',
          category: item.category || null,
        }
      }).catch(() => { });
      gCount++;
    }
  }
  console.log(`✅ 用語集: ${gCount}件`);
}

async function seedFacilities() {
  const facilities = loadJSON('facilities', 'facilities.json');
  const courts = loadJSON('facilities', 'facility_courts.json') || [];
  const shops = loadJSON('facilities', 'facility_shops.json') || [];
  let count = 0;

  if (facilities && Array.isArray(facilities)) {
    for (let cidx = 0; cidx < facilities.length; cidx++) {
      const f = facilities[cidx];
      try {
        const amenities = f.facility_amenities || {};
        let fullAddress = f.address || '';
        if (f.prefecture && !fullAddress.includes(f.prefecture)) {
          fullAddress = `${f.prefecture}${f.city || ''}${fullAddress}`;
        }

        console.log(`... facility index ${cidx} started ...`);
        const facility = await prisma.facility.create({
          data: {
            name: f.name || `Facility ${cidx}`,
            address: fullAddress,
            lat: toFloat(f.latitude || f.lat),
            lng: toFloat(f.longitude || f.lng),
            directionsUrl: f.directions_url || null,
            accessGuide: f.access_guide || null,
            mainPhotoUrl: f.main_photo_url || f.image_url || null,
            youtubeUrl: f.youtube_url || null,
            typeFlag: f.type_flag ? parseInt(String(f.type_flag)) : 1,
            operatorType: f.operator_type || null,
            isPremium: toBool(f.is_premium),
            hostsTournaments: toBool(f.hosts_tournaments),
            tournamentTypes: f.tournament_types || null,
            hasShower: toBool(amenities.has_shower),
            hasLockerRoom: toBool(amenities.has_locker_room),
            hasCafe: toBool(amenities.has_cafe),
            hasKidsSpace: toBool(amenities.has_kids_space),
            hasParking: toBool(amenities.has_parking),
            hasWifi: toBool(amenities.has_wifi),
            hoursMon: f.hours_mon || null,
            hoursTue: f.hours_tue || null,
            hoursWed: f.hours_wed || null,
            hoursThu: f.hours_thu || null,
            hoursFri: f.hours_fri || null,
            hoursSat: f.hours_sat || null,
            hoursSun: f.hours_sun || null,
            reservationMethod: f.reservation_method || null,
          },
        });
        console.log(`... facility index ${cidx} created id: ${facility.id}`);

        // Add Courts corresponding to this facility
        const myCourts = courts.filter((c: any) => c._facility_index === cidx);
        for (const court of myCourts) {
          await prisma.facilityCourt.create({
            data: {
              facilityId: facility.id,
              courtType: court.court_type || null,
              numberOfCourts: toInt(court.number_of_courts) || 0,
              surfaceType: court.surface_type || null,
              lineVisibility: court.line_visibility || null,
              netType: court.net_type || null,
              hasAc: toBool(court.has_ac),
              baselineMargin: court.baseline_margin || null,
              lightingType: court.lighting_type || null,
            }
          });
        }

        // Add Shops corresponding to this facility
        const myShops = shops.filter((s: any) => s._facility_index === cidx);
        for (const shop of myShops) {
          await prisma.facilityShop.create({
            data: {
              facilityId: facility.id,
              hasPaddleSales: toBool(shop.has_paddle_sales),
              hasApparelSales: toBool(shop.has_apparel_sales),
              hasPaddleRental: toBool(shop.has_paddle_rental),
              paddleRentalFee: toInt(shop.paddle_rental_fee),
              handledBrands: Array.isArray(shop.handled_brands) ? shop.handled_brands.join(', ') : (shop.handled_brands || null),
            }
          });
        }
        count++;
      } catch (e: any) {
        console.error(`❌ 施設エラー: ${e.message}`);
      }
    }
  }
  console.log(`✅ 施設: ${count}件`);
}

async function seedGears() {
  const mapData = async (file: string, model: any, mapFn: (data: any) => any) => {
    const data = loadJSON('gears', file);
    let count = 0;
    if (data && Array.isArray(data)) {
      for (const item of data) {
        try {
          await model.create({ data: mapFn(item) });
          count++;
        } catch (e) { }
      }
    }
    return count;
  };

  const pCount = await mapData('paddles.json', prisma.gearPaddle, p => ({
    brandName: p.brand_name || 'Unknown', productName: p.product_name || 'Unknown', price: toInt(p.price),
    paddleShape: p.paddle_shape || null, faceMaterial: p.face_material || null, coreMaterial: p.core_material || null,
    coreThickness: toFloat(p.core_thickness), targetDemographic: p.target_demographic || null, designTaste: p.design_taste || null,
    colorVariations: Array.isArray(p.color_variations) ? p.color_variations.join(', ') : (p.color_variations || null),
    amazonUrl: p.amazon_url || null, rakutenUrl: p.rakuten_url || null, yahooUrl: p.yahoo_url || null, imageUrl: p.image_url || p.main_image_url || null,
  }));
  console.log(`✅ パドル: ${pCount}件`);

  const sCount = await mapData('shoes.json', prisma.gearShoe, s => ({
    brandName: s.brand_name || 'Unknown', productName: s.product_name || 'Unknown', price: toInt(s.price),
    sizeRange: s.size_range || null, courtType: s.court_type || null,
    colorVariations: Array.isArray(s.color_variations) ? s.color_variations.join(', ') : (s.color_variations || null),
    amazonUrl: s.amazon_url || null, rakutenUrl: s.rakuten_url || null, yahooUrl: s.yahoo_url || null, imageUrl: s.image_url || null,
  }));
  console.log(`✅ シューズ: ${sCount}件`);

  const bCount = await mapData('balls.json', prisma.gearBall, b => ({
    brandName: b.brand_name || 'Unknown', productName: b.product_name || 'Unknown', price: toInt(b.price),
    grade: b.grade || null, ballType: b.ball_type || null,
    colorVariations: Array.isArray(b.color_variations) ? b.color_variations.join(', ') : (b.color_variations || null),
    amazonUrl: b.amazon_url || null, rakutenUrl: b.rakuten_url || null, yahooUrl: b.yahoo_url || null, imageUrl: b.image_url || null,
  }));
  console.log(`✅ ボール: ${bCount}件`);

  const aCount = await mapData('apparel.json', prisma.gearApparel, a => ({
    brandName: a.brand_name || 'Unknown', productName: a.product_name || 'Unknown', price: toInt(a.price),
    category: a.category || null, targetGender: a.target_gender || null, materialFeatures: a.material_features || null,
    hasBallPocket: toBool(a.has_ball_pocket), designTaste: a.design_taste || null, sizeRange: a.size_range || null,
    colorVariations: Array.isArray(a.color_variations) ? a.color_variations.join(', ') : (a.color_variations || null),
    amazonUrl: a.amazon_url || null, rakutenUrl: a.rakuten_url || null, yahooUrl: a.yahoo_url || null, imageUrl: a.image_url || null,
  }));
  console.log(`✅ アパレル: ${aCount}件`);

  const bagCount = await mapData('bags.json', prisma.gearBag, b => ({
    brandName: b.brand_name || 'Unknown', productName: b.product_name || 'Unknown', price: toInt(b.price),
    bagType: b.bag_type || null, paddleCapacity: toInt(b.paddle_capacity),
    hasShoePocket: toBool(b.has_shoe_pocket), hasFenceHook: toBool(b.has_fence_hook), hasThermalPocket: toBool(b.has_thermal_pocket),
    colorVariations: Array.isArray(b.color_variations) ? b.color_variations.join(', ') : (b.color_variations || null),
    amazonUrl: b.amazon_url || null, rakutenUrl: b.rakuten_url || null, yahooUrl: b.yahoo_url || null, imageUrl: b.image_url || null,
  }));
  console.log(`✅ バッグ: ${bagCount}件`);

  const accCount = await mapData('accessories.json', prisma.gearAccessory, a => ({
    brandName: a.brand_name || 'Unknown', productName: a.product_name || 'Unknown', price: toInt(a.price),
    category: a.category || null, subCategory: a.sub_category || null, specificFeatures: a.specific_features || null,
    colorVariations: Array.isArray(a.color_variations) ? a.color_variations.join(', ') : (a.color_variations || null),
    amazonUrl: a.amazon_url || null, rakutenUrl: a.rakuten_url || null, yahooUrl: a.yahoo_url || null, imageUrl: a.image_url || null,
    priceUsd: toFloat(a.price_usd), priceTier: a.price_tier || null,
  }));
  console.log(`✅ アクセサリー: ${accCount}件`);
}

async function seedContent() {
  const articles = loadJSON('content', 'articles.json');
  let aCount = 0;
  if (articles && Array.isArray(articles)) {
    for (const a of articles) {
      const slug = a.id || a.slug || `article-${Date.now()}-${aCount}`;
      await prisma.article.create({
        data: {
          slug, title: a.title || 'Untitled', content: a.content || a.description || '',
          category: a.category || null, targetAudience: a.target_audience || null,
          thumbnailUrl: a.thumbnail_url || a.image_url || null, status: 'published',
        }
      }).catch(() => { });
      aCount++;
    }
  }
  console.log(`✅ 記事: ${aCount}件`);

  // ドリル (training_drills.json or drills.json)
  const drills = loadJSON('supplementary', 'training_drills.json') || loadJSON('content', 'drills.json');
  let dCount = 0;
  if (drills && Array.isArray(drills)) {
    for (const d of drills) {
      await prisma.drill.create({
        data: {
          title: d.title || 'Untitled', description: d.description || '',
          difficulty: d.difficulty || null, minPlayers: toInt(d.min_players),
          durationMin: toInt(d.duration_min), videoUrl: d.youtube_url || d.video_url || null,
          imageUrl: d.image_url || null,
        }
      }).catch(() => { });
      dCount++;
    }
  }
  console.log(`✅ ドリル: ${dCount}件`);

  // Players
  const players = loadJSON('players', 'pro_players.json') || loadJSON('players', 'domestic_players.json');
  let pCount = 0;
  if (players && Array.isArray(players)) {
    for (const p of players) {
      await prisma.proPlayer.create({
        data: {
          nameJa: p.name_ja || 'Unknown', nameEn: p.name_en || null, nationality: p.nationality || null,
          playStyle: p.play_style || null, leagueAffiliation: p.league_affiliation || null,
          rankingSingles: toInt(p.ranking_singles), rankingDoubles: toInt(p.ranking_doubles),
          instagramUrl: p.instagram_url || null, xUrl: p.x_url || null, photoUrl: p.photo_url || null,
        }
      }).catch(() => { });
      pCount++;
    }
  }
  console.log(`✅ 選手: ${pCount}件`);

  // Communities
  const communities = loadJSON('community', 'communities.json');
  let cCount = 0;
  if (communities && Array.isArray(communities)) {
    for (const c of communities) {
      await prisma.community.create({
        data: {
          name: c.name || 'Unknown', description: c.description || null,
          beginnerFriendly: toBool(c.beginner_friendly), playStyle: c.play_style || null,
          activityFrequency: c.activity_frequency || null, externalUrl: c.external_url || null,
          locationText: c.location_text || null, targetArea: c.target_area || null,
          mainPhotoUrl: c.main_photo_url || null,
        }
      }).catch(() => { });
      cCount++;
    }
  }
  console.log(`✅ コミュニティ: ${cCount}件`);
}

async function main() {
  console.log('🚀 I LOVE PICKLEBALL シードスクリプト開始...');
  await cleanDatabase();
  await seedMasterData();
  await seedFacilities();
  await seedGears();
  await seedContent();
  console.log('🎉 全データ投入完了！');
}

main().catch(console.error).finally(() => prisma.$disconnect());
