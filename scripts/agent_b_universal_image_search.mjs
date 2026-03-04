import fs from 'fs';
import https from 'https';

async function fetchHtml(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

// 汎用画像検索（Yahoo Image Search）から、ショッピングサイト等の画像を優先して取得
async function searchImage(query) {
    const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);

    // 画像検索結果のHTMLからJSON-likeなデータを探すか、data-srcを抜く
    // Yahooの画像検索は <li>...<img src="...&url=実際のURL... " data-src="..."> のように含まれることがある
    const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/gi;
    let match;
    const candidates = [];

    while ((match = imgRegex.exec(html)) !== null) {
        let src = match[1];
        if (src.startsWith('http') && !src.includes('clear.gif') && !src.includes('yimg.com/a/a.gif')) {
            // YahooのサムネイルURL(yimg.comなど)は解像度が低めだが、一時的ではない
            candidates.push(src);
        }
    }

    // 最初の有効なサムネイルを返す
    return candidates.length > 0 ? candidates[0] : null;
}

async function processFile(filePath, itemType) {
    let raw = fs.readFileSync(filePath, 'utf-8');
    let items = JSON.parse(raw);
    let updated = 0;

    for (let p of items) {
        // すでに公式CDN画像など(image_sourceがある)が設定されていればスキップ
        if (p.image_source && !p.image_source.includes('Google') && !p.image_url.includes('gstatic.com')) {
            continue;
        }

        const query = `${p.brand_name || ''} ${p.product_name || p.name} ${itemType} product image`;
        const imgUrl = await searchImage(query);

        if (imgUrl) {
            p.image_url = imgUrl;
            p.image_source = 'Yahoo Image Search (Shopping/Web)';
            console.log(`[OK] ${p.id} -> ${p.image_url.substring(0, 60)}...`);
            updated++;
        }

        // わずかなWaitを入れてブロック回避
        await new Promise(r => setTimeout(r, 200));
    }

    if (updated > 0) {
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf-8');
        console.log(`\nUpdated ${updated} ${itemType}s in ${filePath}`);
    } else {
        console.log(`\nNo updates needed for ${itemType}s.`);
    }
}

(async () => {
    console.log('--- Paddles ---');
    await processFile('production_data/gears/paddles.json', 'pickleball paddle');
    console.log('\n--- Shoes ---');
    await processFile('production_data/gears/shoes.json', 'pickleball shoes');
    console.log('\n--- Balls ---');
    await processFile('production_data/gears/balls.json', 'pickleball');
    console.log('\n--- Bags ---');
    await processFile('production_data/gears/bags.json', 'pickleball bag');
})();
