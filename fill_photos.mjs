import fs from 'fs';
import path from 'path';
import https from 'https';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'price_guide.json');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function fetchOgImage(url) {
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8'
            }
        }, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchOgImage(res.headers.location));
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<meta property="og:image" content="([^"]+)"/i);
                if (match && match[1]) {
                    resolve(match[1]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

(async () => {
    let updatedCount = 0;
    for (const file of files) {
        const filePath = path.join(dir, file);
        let data;
        try {
            data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) { continue; }
        if (!data.facilities) continue;

        let modified = false;
        for (const fac of data.facilities) {
            if ((fac.type_flag === 1 || fac.type_flag === 3) && !fac.main_photo_url && fac.google_maps_url) {
                console.log(`Fetching photo for: ${fac.name}`);
                const photoUrl = await fetchOgImage(fac.google_maps_url);

                if (photoUrl) {
                    console.log(`-> Found: ${photoUrl.slice(0, 50)}...`);
                    fac.main_photo_url = photoUrl;
                    modified = true;
                    updatedCount++;
                } else {
                    console.log(`-> Not Found`);
                    // Fallback generic photo based on operator_type
                    fac.main_photo_url = fac.operator_type?.includes('自治体') ?
                        "https://images.unsplash.com/photo-1577416412292-747c6607f055?auto=format&fit=crop&q=80&w=1000" :
                        "https://images.unsplash.com/photo-1622228585918-6c84b127ff20?auto=format&fit=crop&q=80&w=1000";
                    modified = true;
                }
                await delay(500); // polite delay
            } else if (!fac.main_photo_url) {
                fac.main_photo_url = fac.operator_type?.includes('自治体') ?
                    "https://images.unsplash.com/photo-1577416412292-747c6607f055?auto=format&fit=crop&q=80&w=1000" :
                    "https://images.unsplash.com/photo-1622228585918-6c84b127ff20?auto=format&fit=crop&q=80&w=1000";
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
            console.log(`Saved ${file}`);
        }
    }
    console.log(`Done. Updated ${updatedCount} photos.`);
})();
