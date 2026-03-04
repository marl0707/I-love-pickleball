import fs from 'fs';
import https from 'https';

async function fetchHtml(url) {
    return new Promise((resolve) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

async function searchDDG(query) {
    const q = encodeURIComponent(query);
    const html = await fetchHtml(`https://html.duckduckgo.com/html/?q=${q}`);
    const results = [];

    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        let text = match[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
        results.push(text);
        if (results.length >= 3) break;
    }
    return results;
}

(async () => {
    let raw = fs.readFileSync('production_data/gears/shoes.json', 'utf-8');
    let shoes = JSON.parse(raw);

    // Test top 5
    for (let i = 0; i < 5; i++) {
        let s = shoes[i];
        let name = `${s.brand_name} ${s.product_name}`;
        console.log(`\n--- ${name} ---`);
        const snippets = await searchDDG(`"${name}" shoe weight oz drop mm tennis warehouse`);
        snippets.forEach((sn, idx) => console.log(`[${idx + 1}] ${sn}`));
        await new Promise(r => setTimeout(r, 1000));
    }
})();
