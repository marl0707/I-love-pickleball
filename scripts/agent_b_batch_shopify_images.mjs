import fs from 'fs';
import https from 'https';

const PADDLES_FILE = 'production_data/gears/paddles.json';

// Shopifyを利用している主要パドルメーカーのドメイン一覧
const SHOPIFY_DOMAINS = {
    'JOOLA': 'joola.com',
    'Selkirk': 'selkirk.com',
    'CRBN': 'crbnpickleball.com',
    'Six Zero': 'sixzeropickleball.com',
    'Paddletek': 'www.paddletek.com',
    'Diadem': 'diademsports.com',
    'Vatic Pro': 'vaticpro.com',
    'Ronbus': 'www.ronbus.com',
    'Electrum': 'electrumpickleball.com',
    'Hudef': 'hudefsport.com',
    'OneShot': 'oneshotpickleball.com',
    'Pickleball Apes': 'pickleballapes.com',
    'Engage': 'engagepickleball.com',
    'Friday': 'fridaypickle.com',
    'Bread & Butter': 'bnbpickleball.com',
    'GRUVN': 'gruvn.co'
};

const CACHE = {};

function fetchShopify(domain) {
    if (CACHE[domain]) return Promise.resolve(CACHE[domain]);

    return new Promise((resolve) => {
        https.get(`https://${domain}/products.json?limit=250`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const j = JSON.parse(data);
                    CACHE[domain] = j.products || [];
                    resolve(CACHE[domain]);
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

function normalizeStr(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
    let raw = fs.readFileSync(PADDLES_FILE, 'utf-8');
    let paddles = JSON.parse(raw);
    let updatedCount = 0;

    for (let p of paddles) {
        // すでに公式画像が入っているか、image_sourceがあるものはスキップ
        if (p.image_source && !p.image_source.includes('Google') && !p.image_url.includes('gstatic.com')) {
            continue;
        }

        const domain = SHOPIFY_DOMAINS[p.brand_name];
        if (!domain) continue;

        const products = await fetchShopify(domain);

        // 商品名マッチング
        let match = null;
        let searchName = normalizeStr(p.product_name);

        // 1. 完全一致に近いもの
        match = products.find(prod => normalizeStr(prod.title).includes(searchName) || searchName.includes(normalizeStr(prod.title)));

        // 2. キーワードマッチ（簡易）
        if (!match) {
            const keywords = p.product_name.toLowerCase().split(' ').filter(k => k.length > 2 && k !== 'pickleball' && k !== 'paddle');
            match = products.find(prod => {
                const titleLower = prod.title.toLowerCase();
                return keywords.every(k => titleLower.includes(k));
            });
        }

        if (match && match.images && match.images.length > 0) {
            p.image_url = match.images[0].src.split('?v=')[0]; // Query stringを外してクリーンに
            p.image_source = `${domain} (Shopify API)`;
            console.log(`[OK] ${p.id} -> ${p.image_url}`);
            updatedCount++;
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(PADDLES_FILE, JSON.stringify(paddles, null, 2) + '\n', 'utf-8');
        console.log(`\nUpdated ${updatedCount} paddles with high-res official CDN images.`);
    } else {
        console.log('\nNo matching images found via Shopify API.');
    }
}

run();
