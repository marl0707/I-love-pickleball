import fs from 'fs';
import https from 'https';

async function fetchHtml(url) {
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

async function searchDDGImage(query) {
    const q = encodeURIComponent(query);
    const initHtml = await fetchHtml(`https://duckduckgo.com/?q=${q}&t=h_&iar=images&iax=images&ia=images`);

    // vqd トークンの抽出
    const vqdMatch = initHtml.match(/vqd=([a-zA-Z0-9_-]+)/);
    if (!vqdMatch) {
        return null;
    }
    const vqd = vqdMatch[1];

    // JSON API を叩く
    const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${q}&f=,,,&p=1&vqd=${vqd}`;
    const resultJson = await fetchHtml(apiUrl);

    try {
        const data = JSON.parse(resultJson);
        if (data.results && data.results.length > 0) {
            // Shopify CDNやAmazon, Pickleball Centralなどの信頼性の高い画像を優先
            const sortedResults = data.results.filter(r =>
                !r.image.includes('gstatic') &&
                !r.image.includes('placeholder')
            );
            if (sortedResults.length > 0) {
                return {
                    url: sortedResults[0].image,
                    sourceUrl: sortedResults[0].url
                };
            }
        }
    } catch (e) {
        console.error(`Error parsing JSON for ${query}`);
    }
    return null;
}

async function processFile(filePath, itemType) {
    let raw = fs.readFileSync(filePath, 'utf-8');
    let items = JSON.parse(raw);
    let updated = 0;

    for (let p of items) {
        if (p.image_source && !p.image_source.includes('Google') && !p.image_url.includes('gstatic.com')) {
            continue;
        }

        const brand = p.brand_name || p.brand || '';
        const name = p.product_name || p.name || '';
        const query = `${brand} ${name} ${itemType} product`.trim();

        console.log(`Searching: ${query}`);
        const imgData = await searchDDGImage(query);

        if (imgData) {
            p.image_url = imgData.url;
            // sourceUrlからドメインを抽出
            let domain = 'unknown';
            try {
                domain = new URL(imgData.sourceUrl).hostname;
            } catch (e) { }
            p.image_source = `DuckDuckGo Image Search (${domain})`;

            console.log(`[OK] ${p.id}`);
            console.log(`  -> URL: ${p.image_url.substring(0, 80)}...`);
            console.log(`  -> Source: ${p.image_source}`);
            updated++;
        } else {
            console.log(`[FAIL] ${p.id} - No image found`);
        }

        // わずかなWaitを入れてブロック回避
        await new Promise(r => setTimeout(r, 1000));
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
