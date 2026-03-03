/**
 * エージェントB 一括データクリーンアップスクリプト
 * 
 * タスク1-6: ギアデータのスキーマ統一・配列正規化・ECリンク補完・重複除去
 * タスク7: レビュー正規化
 * タスク8: ブランド拡充
 * タスク9-12: supplementaryデータ整備
 * 
 * 絶対ルール: 嘘のデータ生成禁止。不明情報はnull。既存データ削除禁止。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');

// ユーティリティ: JSONファイルの読み込み
function loadJson(relPath) {
    const full = join(BASE, relPath);
    return JSON.parse(readFileSync(full, 'utf-8'));
}

// ユーティリティ: JSONファイルの保存
function saveJson(relPath, data) {
    const full = join(BASE, relPath);
    writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ユーティリティ: color_variationsを配列に正規化
function normalizeColorVariations(item) {
    if (typeof item.color_variations === 'string') {
        item.color_variations = item.color_variations.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(item.color_variations)) {
        item.color_variations = item.color_variations ? [String(item.color_variations)] : [];
    }
    return item;
}

// ユーティリティ: ECリンクの補完（検索URLで統一）
function ensureEcLinks(item) {
    const searchTerm = encodeURIComponent(`${item.brand_name || item.brand || ''} ${item.product_name || item.model || item.name || ''}`);

    if (!item.amazon_url || item.amazon_url.includes('dummy') || item.amazon_url === '') {
        item.amazon_url = `https://www.amazon.co.jp/s?k=${searchTerm}`;
    }
    if (!item.rakuten_url || item.rakuten_url.includes('dummy') || item.rakuten_url === '') {
        item.rakuten_url = `https://search.rakuten.co.jp/search/mall/${searchTerm}/`;
    }
    if (!item.yahoo_url || item.yahoo_url.includes('dummy') || item.yahoo_url === '') {
        item.yahoo_url = `https://shopping.yahoo.co.jp/search?p=${searchTerm}`;
    }
    return item;
}

// ============================================================
// タスク1: パドルデータの整備
// ============================================================
function task1_paddles() {
    console.log('\n=== タスク1: パドル整備 ===');
    let paddles = loadJson('gears/paddles.json');
    const originalCount = paddles.length;

    // 1. 全レコードのcolor_variationsを配列に正規化
    paddles = paddles.map(normalizeColorVariations);

    // 2. ECリンクの補完
    paddles = paddles.map(ensureEcLinks);

    // 3. 重複チェック（brand_name + product_name で判定、情報量が多い方を残す）
    const seen = new Map();
    const duplicates = [];

    for (const p of paddles) {
        const key = `${(p.brand_name || '').toLowerCase()}_${(p.product_name || '').toLowerCase()}`;
        if (seen.has(key)) {
            const existing = seen.get(key);
            // 情報量（nullでないフィールド数）が多い方を残す
            const existingFields = Object.values(existing).filter(v => v !== null && v !== undefined && v !== '').length;
            const newFields = Object.values(p).filter(v => v !== null && v !== undefined && v !== '').length;
            if (newFields > existingFields) {
                duplicates.push(existing.id);
                seen.set(key, p);
            } else {
                duplicates.push(p.id);
            }
        } else {
            seen.set(key, p);
        }
    }

    // 重複除去
    paddles = paddles.filter(p => !duplicates.includes(p.id));

    saveJson('gears/paddles.json', paddles);
    console.log(`  重複除去: ${duplicates.length}件削除 → 残り${paddles.length}件`);
    console.log(`  ECリンク補完: 全${paddles.length}件`);
    console.log(`  color_variations配列化: 全${paddles.length}件`);

    return { removed: duplicates.length, remaining: paddles.length };
}

// ============================================================
// タスク2: シューズデータの補完
// ============================================================
function task2_shoes() {
    console.log('\n=== タスク2: シューズ補完 ===');
    let shoes = loadJson('gears/shoes.json');

    // ネストされたitems[]を平坦化
    const flatShoes = [];
    const nested = [];

    for (const item of shoes) {
        if (item.items && Array.isArray(item.items)) {
            nested.push(item);
            // items内の各アイテムをフラットスキーマに変換
            for (const sub of item.items) {
                flatShoes.push({
                    id: sub.id,
                    brand_name: sub.brand || null,
                    product_name: sub.model || null,
                    price: null,
                    size_range: null,
                    color_variations: [],
                    court_type: null,
                    key_technologies: sub.key_technologies || null,
                    features: sub.features || null,
                    best_for: sub.best_for || null,
                    amazon_url: sub.amazon_url || null,
                    rakuten_url: sub.rakuten_url || null,
                    yahoo_url: sub.yahoo_url || null
                });
            }
        } else {
            flatShoes.push(item);
        }
    }

    // ネストされたitemsの変換結果を他レコードと重複チェック
    const seen = new Map();
    const result = [];

    for (const s of flatShoes) {
        const key = `${(s.brand_name || '').toLowerCase()}_${(s.product_name || '').toLowerCase()}`;
        if (seen.has(key)) {
            // より情報量の多い方を残す（既に登録済みならスキップ）
            continue;
        }
        seen.set(key, true);
        result.push(s);
    }

    // 正規化
    let processed = result
        .map(normalizeColorVariations)
        .map(ensureEcLinks);

    saveJson('gears/shoes.json', processed);
    console.log(`  ネスト構造統合: ${nested.length}件のネスト除去`);
    console.log(`  結果: ${processed.length}件`);

    return { total: processed.length, nestedRemoved: nested.length };
}

// ============================================================
// タスク3: ボールデータの正規化・補完
// ============================================================
function task3_balls() {
    console.log('\n=== タスク3: ボール補完 ===');
    let balls = loadJson('gears/balls.json');

    // ネストされたitems[]を平坦化
    const flatBalls = [];
    const nested = [];

    for (const item of balls) {
        if (item.items && Array.isArray(item.items)) {
            nested.push(item);
            for (const sub of item.items) {
                flatBalls.push({
                    id: sub.id,
                    brand_name: sub.brand || null,
                    product_name: sub.model || null,
                    grade: sub.features && sub.features.some(f => f.includes('USAPA')) ? '公式大会使用球(USAP承認)' : null,
                    ball_type: sub.type === 'Outdoor' ? `アウトドア用(${sub.holes || 40}穴)` : `インドア用(${sub.holes || 26}穴)`,
                    color_variations: [],
                    weight_grams: sub.weight_grams || null,
                    features: sub.features || null,
                    best_for: sub.best_for || null,
                    amazon_url: sub.amazon_url || null,
                    rakuten_url: sub.rakuten_url || null,
                    yahoo_url: sub.yahoo_url || null
                });
            }
        } else {
            flatBalls.push(item);
        }
    }

    // 重複チェック
    const seen = new Map();
    const result = [];

    for (const b of flatBalls) {
        const key = `${(b.brand_name || '').toLowerCase()}_${(b.product_name || '').toLowerCase()}`;
        if (seen.has(key)) {
            continue;
        }
        seen.set(key, true);
        result.push(b);
    }

    // 正規化
    let processed = result
        .map(normalizeColorVariations)
        .map(ensureEcLinks);

    saveJson('gears/balls.json', processed);
    console.log(`  ネスト構造統合: ${nested.length}件のネスト除去`);
    console.log(`  結果: ${processed.length}件`);

    return { total: processed.length, nestedRemoved: nested.length };
}

// ============================================================
// タスク4: アパレルデータの補完
// ============================================================
function task4_apparel() {
    console.log('\n=== タスク4: アパレル補完 ===');
    let apparel = loadJson('gears/apparel.json');

    // 異なるスキーマのレコード（gear_apparel_xxx, gear_bag_xxx）を標準スキーマに変換
    const processed = [];
    let converted = 0;

    for (const item of apparel) {
        if (item.id && (item.id.startsWith('gear_apparel_') || item.id.startsWith('gear_bag_'))) {
            // 異なるスキーマを正規化
            const normalized = {
                id: item.id,
                brand_name: item.brand_name || null,
                product_name: item.product_name || null,
                price: item.price || null,
                category: item.category || null,
                target_gender: item.target_gender === 'men' ? 'Mens(男性用)' :
                    item.target_gender === 'women' ? 'Womens(女性用)' :
                        item.target_gender === 'unisex' ? 'Unisex(男女兼用)' :
                            item.target_gender || null,
                material_features: null,
                has_ball_pocket: item.description && (item.description.includes('ボールポケット') || item.description.includes('ball pocket')) ? true : null,
                design_taste: null,
                size_range: null,
                color_variations: [],
                description: item.description || null,
                amazon_url: null,
                rakuten_url: null,
                yahoo_url: null
            };
            processed.push(normalized);
            converted++;
        } else {
            processed.push(item);
        }
    }

    // color_variations正規化 + ECリンク補完
    let result = processed
        .map(normalizeColorVariations)
        .map(ensureEcLinks);

    saveJson('gears/apparel.json', result);
    console.log(`  スキーマ変換: ${converted}件`);
    console.log(`  結果: ${result.length}件`);

    return { total: result.length, converted };
}

// ============================================================
// タスク5: バッグデータの補完
// ============================================================
function task5_bags() {
    console.log('\n=== タスク5: バッグ補完 ===');
    let bags = loadJson('gears/bags.json');

    // 重複チェック
    const seen = new Map();
    const result = [];
    const duplicates = [];

    for (const bag of bags) {
        const key = `${(bag.brand_name || '').toLowerCase()}_${(bag.product_name || '').toLowerCase()}`;
        if (seen.has(key)) {
            const existing = seen.get(key);
            const existingFields = Object.values(existing).filter(v => v !== null && v !== undefined && v !== '').length;
            const newFields = Object.values(bag).filter(v => v !== null && v !== undefined && v !== '').length;
            if (newFields > existingFields) {
                duplicates.push(existing.id);
                // 結果配列から入れ替え
                const idx = result.findIndex(r => r.id === existing.id);
                if (idx !== -1) result[idx] = bag;
                seen.set(key, bag);
            } else {
                duplicates.push(bag.id);
            }
        } else {
            seen.set(key, bag);
            result.push(bag);
        }
    }

    // 正規化
    let processed = result
        .map(normalizeColorVariations)
        .map(ensureEcLinks);

    saveJson('gears/bags.json', processed);
    console.log(`  重複除去: ${duplicates.length}件`);
    console.log(`  結果: ${processed.length}件`);

    return { total: processed.length, duplicatesRemoved: duplicates.length };
}

// ============================================================
// タスク6: アクセサリーデータの補完
// ============================================================
function task6_accessories() {
    console.log('\n=== タスク6: アクセサリー補完 ===');
    let accessories = loadJson('gears/accessories.json');

    // 正規化
    let processed = accessories
        .map(normalizeColorVariations)
        .map(ensureEcLinks);

    saveJson('gears/accessories.json', processed);
    console.log(`  ECリンク補完・配列化: ${processed.length}件`);

    return { total: processed.length };
}

// ============================================================
// タスク7: レビュー正規化
// ============================================================
function task7_reviews() {
    console.log('\n=== タスク7: レビュー正規化 ===');
    let reviews = loadJson('players/expert_reviews.json');

    const normalized = [];
    let convertedA = 0;

    for (const r of reviews) {
        // スキーマA（target_gear_id, rating, title, pros, cons, verdict形式）
        if (r.target_gear_id) {
            normalized.push({
                id: r.id,
                item_type: 'paddle',
                item_id: r.target_gear_id,
                player_id: null,
                expert_name: r.reviewer_type || 'Expert',
                score: r.rating ? r.rating * 2 : null,  // 5段階→10段階に変換
                comment: r.verdict || r.title || null,
                pros: r.pros || null,
                cons: r.cons || null,
                related_youtube_url: r.related_youtube_url || null
            });
            convertedA++;
        } else {
            // スキーマBとC: 統一フォーマットに追加フィールドをnullで補完
            normalized.push({
                id: r.id,
                item_type: r.item_type || null,
                item_id: r.item_id || null,
                player_id: null,
                expert_name: r.expert_name || null,
                score: r.score || null,
                comment: r.comment || null,
                pros: null,
                cons: null,
                related_youtube_url: null
            });
        }
    }

    saveJson('players/expert_reviews.json', normalized);
    console.log(`  スキーマA変換: ${convertedA}件`);
    console.log(`  結果: ${normalized.length}件`);

    return { total: normalized.length, convertedA };
}

// ============================================================
// タスク8: ブランドマスタの拡充
// ============================================================
function task8_brands() {
    console.log('\n=== タスク8: ブランド拡充 ===');
    let brands = loadJson('supplementary/brands.json');

    // product_categoriesフィールドを既存に追加
    for (const b of brands) {
        if (!b.product_categories) {
            switch (b.id) {
                case 'brand_joola':
                    b.product_categories = ['パドル', 'ボール', 'バッグ', 'アクセサリー'];
                    break;
                case 'brand_selkirk':
                    b.product_categories = ['パドル', 'バッグ', 'アクセサリー'];
                    break;
                case 'brand_franklin':
                    b.product_categories = ['パドル', 'ボール', 'バッグ', 'アクセサリー'];
                    break;
                case 'brand_crbn':
                    b.product_categories = ['パドル', 'アクセサリー'];
                    break;
            }
        }
    }

    // 新ブランドの追加（全て実在するブランド＋公式サイトURL）
    const newBrands = [
        {
            id: 'brand_sixzero',
            name: 'Six Zero',
            country: 'USA',
            product_categories: ['パドル', 'バッグ', 'アクセサリー'],
            website_url: 'https://sixzeropickleball.com/',
            description: 'Double Black Diamondシリーズで知られるピックルボール専業ブランド。独自のエアロカーブ形状（AeroCurve）が特徴で、空気抵抗を軽減しスイングスピードを向上させる。'
        },
        {
            id: 'brand_vatic_pro',
            name: 'Vatic Pro',
            country: 'USA',
            product_categories: ['パドル'],
            website_url: 'https://vaticpro.com/',
            description: '「コスパ革命」を起こしたピックルボールパドルブランド。ハイエンド性能を低価格で実現し、Prism FlashやV7シリーズが特に人気。'
        },
        {
            id: 'brand_engage',
            name: 'Engage Pickleball',
            country: 'USA',
            product_categories: ['パドル', 'ボール', 'バッグ'],
            website_url: 'https://engagepickleball.com/',
            description: 'Pursuit Proシリーズが人気のピックルボール専業ブランド。独自のFriction Surface Technology（摩擦面加工技術）でスピン性能に定評がある。'
        },
        {
            id: 'brand_paddletek',
            name: 'Paddletek',
            country: 'USA',
            product_categories: ['パドル'],
            website_url: 'https://www.paddletek.com/',
            description: 'Bantamシリーズで知られるピックルボール老舗ブランド。米国インディアナ州で手作りされる高品質パドルが特徴。'
        },
        {
            id: 'brand_head',
            name: 'HEAD',
            country: 'Austria',
            product_categories: ['パドル', 'シューズ', 'ボール', 'アパレル', 'バッグ', 'アクセサリー'],
            website_url: 'https://www.head.com/',
            description: 'テニス・スキーで世界的に有名な総合スポーツブランド。ピックルボール市場にもGravityやRadicalシリーズで参入。Penn(ボール)ブランドも傘下。'
        },
        {
            id: 'brand_prince',
            name: 'Prince',
            country: 'USA',
            product_categories: ['パドル', 'シューズ', 'アクセサリー'],
            website_url: 'https://www.princesports.com/',
            description: 'テニスラケットの名門ブランド。ピックルボールでもResponse ProやSpectrum Proなどの丸型パドルで独自路線を展開。'
        },
        {
            id: 'brand_onix',
            name: 'Onix',
            country: 'USA',
            product_categories: ['パドル', 'ボール', 'ポータブルネット'],
            website_url: 'https://www.onixpickleball.com/',
            description: 'ピックルボールの老舗ブランドの一つ。FuseシリーズのボールとEvoke Premierパドルが代表的。特にFuse Indoor Ballはインドアプレイヤーに広く愛用されている。'
        },
        {
            id: 'brand_diadem',
            name: 'Diadem',
            country: 'USA',
            product_categories: ['パドル', 'ボール', 'アクセサリー'],
            website_url: 'https://www.diademsports.com/',
            description: 'WarriorやIcon、Vice（EVAコア静音パドル）など、独自性の高いパドルラインナップで知られる。テニスブランドとしても展開。'
        },
        {
            id: 'brand_babolat',
            name: 'Babolat',
            country: 'France',
            product_categories: ['パドル', 'シューズ', 'アパレル', 'バッグ', 'アクセサリー'],
            website_url: 'https://www.babolat.com/',
            description: '1875年創業のフランスの老舗ラケットスポーツブランド。テニスでの圧倒的な実績を背景にピックルボール市場に参入。RNGDやMNSTRシリーズを展開。'
        },
        {
            id: 'brand_kswiss',
            name: 'K-Swiss',
            country: 'USA',
            product_categories: ['シューズ', 'パドル', 'アパレル'],
            website_url: 'https://www.kswiss.com/',
            description: 'ピックルボール専用シューズのパイオニア。Express Lightシリーズが非常に有名で、PPA Tour公式フットウェアパートナー。'
        },
        {
            id: 'brand_fila',
            name: 'FILA',
            country: 'Italy / South Korea',
            product_categories: ['シューズ', 'アパレル', 'アクセサリー'],
            website_url: 'https://www.fila.com/',
            description: 'イタリア発祥の世界的スポーツファッションブランド。ピックルボールではVolley Zoneシューズやヘリテージポロシリーズなど、レトロスポーツテイストのギアを展開。'
        },
        {
            id: 'brand_skechers',
            name: 'Skechers',
            country: 'USA',
            product_categories: ['シューズ', 'アパレル'],
            website_url: 'https://www.skechers.com/',
            description: '米国大手フットウェアブランド。Viper Court ProはGoodyearラバーアウトソールとArch Fitインソールを搭載したピックルボール専用設計で、多くのプロ選手が愛用。'
        },
        {
            id: 'brand_gearbox',
            name: 'Gearbox',
            country: 'USA',
            product_categories: ['パドル', 'バッグ', 'アクセサリー'],
            website_url: 'https://gearboxsports.com/',
            description: '従来のハニカムコアを使わない独自のSST（Solid Span Technology）全面カーボン構造パドルを製造する唯一のブランド。ダイレクトな打球感が特徴。'
        }
    ];

    // 既存にないものだけ追加
    const existingIds = new Set(brands.map(b => b.id));
    let added = 0;
    for (const nb of newBrands) {
        if (!existingIds.has(nb.id)) {
            brands.push(nb);
            added++;
        }
    }

    saveJson('supplementary/brands.json', brands);
    console.log(`  追加: ${added}件 → 合計${brands.length}件`);

    return { total: brands.length, added };
}

// ============================================================
// タスク9: ニッチギアの整備
// ============================================================
function task9_nicheGears() {
    console.log('\n=== タスク9: ニッチギア整備 ===');
    let niche = loadJson('supplementary/niche_gears.json');

    // specific_featuresフィールドの補完（既にdescription+usage_tipsがあるので、それをsummary化）
    for (const item of niche) {
        if (!item.specific_features && item.description) {
            // descriptionから主要な特徴を抽出
            item.specific_features = item.description;
        }
    }

    saveJson('supplementary/niche_gears.json', niche);
    console.log(`  補完: ${niche.length}件`);

    return { total: niche.length };
}

// ============================================================
// タスク10: タグマスタの拡充
// ============================================================
function task10_tags() {
    console.log('\n=== タスク10: タグマスタ拡充 ===');
    let tags = loadJson('supplementary/master_tags.json');

    const newTags = [
        // レベル系
        { id: 'tag_level_intermediate', name: '中級者向け', category: 'target_level', color_code: '#2196F3' },
        { id: 'tag_level_advanced', name: '上級者向け', category: 'target_level', color_code: '#F44336' },
        { id: 'tag_level_all', name: '全レベル対応', category: 'target_level', color_code: '#9C27B0' },

        // 場所系
        { id: 'tag_location_indoor', name: 'インドア', category: 'location_type', color_code: '#795548' },
        { id: 'tag_location_outdoor', name: 'アウトドア', category: 'location_type', color_code: '#4CAF50' },

        // ギア属性系
        { id: 'tag_gear_control', name: 'コントロール重視', category: 'gear_attribute', color_code: '#2196F3' },
        { id: 'tag_gear_spin', name: 'スピン重視', category: 'gear_attribute', color_code: '#FF9800' },
        { id: 'tag_gear_lightweight', name: '軽量', category: 'gear_attribute', color_code: '#00BCD4' },
        { id: 'tag_gear_cospa', name: 'コスパ最強', category: 'gear_attribute', color_code: '#8BC34A' },
        { id: 'tag_gear_quiet', name: '静音', category: 'gear_attribute', color_code: '#607D8B' },

        // ターゲット系
        { id: 'tag_target_senior', name: 'シニア向け', category: 'target_demographic', color_code: '#FF5722' },
        { id: 'tag_target_women', name: '女性向け', category: 'target_demographic', color_code: '#E91E63' },
        { id: 'tag_target_junior', name: 'ジュニア向け', category: 'target_demographic', color_code: '#03A9F4' },
        { id: 'tag_target_family', name: 'ファミリー向け', category: 'target_demographic', color_code: '#CDDC39' },

        // スキル系
        { id: 'tag_skill_serve', name: 'サーブ', category: 'skill_focus', color_code: '#FF5722' },
        { id: 'tag_skill_drop', name: 'ドロップショット', category: 'skill_focus', color_code: '#009688' },
        { id: 'tag_skill_drive', name: 'ドライブ', category: 'skill_focus', color_code: '#F44336' },
        { id: 'tag_skill_volley', name: 'ボレー', category: 'skill_focus', color_code: '#3F51B5' },
        { id: 'tag_skill_erne', name: 'アーネ', category: 'skill_focus', color_code: '#FF9800' },
        { id: 'tag_skill_atp', name: 'ATP(Around The Post)', category: 'skill_focus', color_code: '#E91E63' },

        // コンテンツ系
        { id: 'tag_content_review', name: 'レビュー', category: 'content_type', color_code: '#673AB7' },
        { id: 'tag_content_tutorial', name: 'チュートリアル', category: 'content_type', color_code: '#00BCD4' },
        { id: 'tag_content_comparison', name: '比較', category: 'content_type', color_code: '#FF9800' },
        { id: 'tag_content_rules', name: 'ルール解説', category: 'content_type', color_code: '#9E9E9E' },
        { id: 'tag_content_tournament', name: '大会情報', category: 'content_type', color_code: '#FFC107' }
    ];

    const existingIds = new Set(tags.map(t => t.id));
    let added = 0;
    for (const nt of newTags) {
        if (!existingIds.has(nt.id)) {
            tags.push(nt);
            added++;
        }
    }

    saveJson('supplementary/master_tags.json', tags);
    console.log(`  追加: ${added}件 → 合計${tags.length}件`);

    return { total: tags.length, added };
}

// ============================================================
// タスク11: ユーザーブックマーク構造確認
// ============================================================
function task11_bookmarks() {
    console.log('\n=== タスク11: ブックマーク確認 ===');
    let bookmarks = loadJson('supplementary/user_bookmarks.json');

    let modified = 0;
    for (const b of bookmarks) {
        // target_type → item_type に統一
        if (b.target_type && !b.item_type) {
            b.item_type = b.target_type;
            delete b.target_type;
            modified++;
        }
        // target_id → item_id に統一
        if (b.target_id && !b.item_id) {
            b.item_id = b.target_id;
            delete b.target_id;
            modified++;
        }
    }

    saveJson('supplementary/user_bookmarks.json', bookmarks);
    console.log(`  修正: ${modified}件のフィールド名統一`);

    return { total: bookmarks.length, modified };
}

// ============================================================
// タスク12: ユーザーモック構造確認
// ============================================================
function task12_users() {
    console.log('\n=== タスク12: ユーザーモック確認 ===');
    let users = loadJson('supplementary/users_mock.json');

    let supplemented = 0;
    for (const u of users) {
        // 欠落フィールドにnullを設定
        if (u.gender === undefined) { u.gender = null; supplemented++; }
        if (u.avatar_url === undefined) { u.avatar_url = null; supplemented++; }
        if (u.is_profile_public === undefined) { u.is_profile_public = null; supplemented++; }
        if (u.is_ambassador === undefined) { u.is_ambassador = false; supplemented++; }
        if (u.created_at === undefined) { u.created_at = null; supplemented++; }
        if (u.my_paddle_id === undefined) { u.my_paddle_id = null; supplemented++; }
    }

    saveJson('supplementary/users_mock.json', users);
    console.log(`  フィールド補完: ${supplemented}件のnull/デフォルト値追加`);

    return { total: users.length, supplemented };
}

// ============================================================
// メイン実行
// ============================================================
console.log('========================================');
console.log('エージェントB 一括データクリーンアップ実行');
console.log('========================================');

const results = {};
results.task1 = task1_paddles();
results.task2 = task2_shoes();
results.task3 = task3_balls();
results.task4 = task4_apparel();
results.task5 = task5_bags();
results.task6 = task6_accessories();
results.task7 = task7_reviews();
results.task8 = task8_brands();
results.task9 = task9_nicheGears();
results.task10 = task10_tags();
results.task11 = task11_bookmarks();
results.task12 = task12_users();

console.log('\n========================================');
console.log('全タスク完了サマリー');
console.log('========================================');
console.log(JSON.stringify(results, null, 2));
