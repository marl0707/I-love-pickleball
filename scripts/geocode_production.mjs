import fs from 'fs';
import https from 'https';

const dataPath = 'production_data/facilities/facilities.json';
const f = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function geocode(query) {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=jp`;
        https.get(url, {
            headers: { 'User-Agent': 'ILovePickleball DataEnrichment/2.0 (sejima)' }
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

async function run() {
    console.log('--- 緯度・経度(ジオコーディング)補完プロセス 開始 ---');
    let updatedCount = 0;

    // We only process facilities missing latitude/longitude
    const missingCoords = f.filter(fac => fac.name && (fac.latitude == null || fac.longitude == null));
    console.log(`補完対象施設数: ${missingCoords.length}件`);

    for (let i = 0; i < missingCoords.length; i++) {
        const fac = missingCoords[i];
        let coords = null;

        // 1. Try with exact address if it exists
        if (fac.address) {
            // Address might contain building names which fail nominatim, so we clean it up slightly or just try
            const cleanAddr = fac.address.split(/[ 　]/)[0]; // take the first part usually pre/city/ward
            coords = await geocode(fac.address);
            if (!coords && cleanAddr !== fac.address) {
                await delay(1500);
                coords = await geocode(cleanAddr);
            }
            await delay(1500);
        }

        // 2. Try with facility name + prefecture
        if (!coords && fac.name) {
            const cleanName = fac.name.split('（')[0].split('【')[0].split('(')[0].trim();
            const q = `${fac.prefecture || ''} ${cleanName}`.trim();
            coords = await geocode(q);
            await delay(1500);
        }

        if (coords) {
            fac.latitude = coords.lat;
            fac.longitude = coords.lon;
            updatedCount++;
            console.log(`[${i + 1}/${missingCoords.length}] SUCCESS: ${fac.name} -> ${coords.lat}, ${coords.lon}`);
        } else {
            console.log(`[${i + 1}/${missingCoords.length}] FAILED : ${fac.name}`);
        }

        // Save incrementally every 20 updates so we don't lose data
        if (updatedCount > 0 && updatedCount % 20 === 0) {
            fs.writeFileSync(dataPath, JSON.stringify(f, null, 2), 'utf8');
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(f, null, 2), 'utf8');
    console.log(`\n完了: ${updatedCount}件の施設の緯度・経度を特定し、補完しました。`);
}

run();
