import fs from 'fs';
import path from 'path';
import https from 'https';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'price_guide.json');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function geocode(query) {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        https.get(url, {
            headers: { 'User-Agent': 'ILovePickleball DataEnrichment/1.0' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.length > 0) {
                        resolve({ lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) });
                    } else {
                        resolve(null);
                    }
                } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

(async () => {
    let updatedCount = 0;
    for (const file of files) {
        const filePath = path.join(dir, file);
        let modified = false;
        let data;
        try {
            data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) { continue; }

        if (!data.facilities) continue;

        for (const fac of data.facilities) {
            if (fac.type_flag === 1 || fac.type_flag === 3) {
                if (fac.latitude == null || fac.longitude == null) {
                    // 1. Try with full address
                    let coords = null;
                    if (fac.address) {
                        console.log(`Geocoding (address): ${fac.address}`);
                        coords = await geocode(fac.address);
                        await delay(1500); // 1.5s delay for Nominatim limit
                    }
                    // 2. Try with name if address fails
                    if (!coords && fac.name) {
                        const cleanName = fac.name.split('（')[0].split('【')[0].trim();
                        const q = `${fac.prefecture || ''} ${cleanName}`.trim();
                        console.log(`Geocoding (name): ${q}`);
                        coords = await geocode(q);
                        await delay(1500);
                    }

                    if (coords) {
                        console.log(`SUCCESS: ${fac.name} -> ${coords.lat}, ${coords.lon}`);
                        fac.latitude = coords.lat;
                        fac.longitude = coords.lon;
                        modified = true;
                        updatedCount++;
                    } else {
                        console.log(`FAILED: ${fac.name}`);
                    }
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Saved ${file}`);
        }
    }
    console.log(`Done. Updated ${updatedCount} facilities.`);
})();
