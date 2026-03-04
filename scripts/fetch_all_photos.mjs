import fs from 'fs';

const dataPath = 'production_data/facilities/facilities.json';
const f = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper to fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

// Extract image from HTML
function extractImage(html, baseUrl) {
    // 1. Try og:image / twitter:image
    const ogMatch = html.match(/<meta\s+(?:[^>]*?\s+)?(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["'](.*?)["']/i);
    if (ogMatch && ogMatch[1]) {
        let imgUrl = ogMatch[1];
        if (imgUrl.trim() === '') return null;
        if (imgUrl.startsWith('/')) {
            try { imgUrl = new URL(imgUrl, baseUrl).href; } catch (e) { }
        }
        return imgUrl;
    }

    // 2. Try to find a reasonable sized image (not logo/icon if possible)
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    for (const match of imgMatches) {
        let src = match[1];
        if (src.includes('logo') || src.includes('icon') || src.includes('.gif') || src.includes('base64')) continue;
        if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.webp')) {
            if (src.startsWith('/')) {
                try { src = new URL(src, baseUrl).href; } catch (e) { }
            }
            if (src.startsWith('http')) return src;
        }
    }
    return null;
}

async function processFacility(facility) {
    const needsPhoto = !facility.main_photo_url || facility.main_photo_url.trim() === '' || facility.main_photo_url.includes('unsplash.com');
    const hasWebsite = facility.website_url && facility.website_url.startsWith('http');

    if (!needsPhoto) return false; // Already has real photo

    if (!hasWebsite) {
        // Clear dummy data
        if (facility.main_photo_url && facility.main_photo_url.includes('unsplash.com')) {
            facility.main_photo_url = null;
            return true; // Modified
        }
        return false; // No change
    }

    try {
        const res = await fetchWithTimeout(facility.website_url, {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        if (res.ok) {
            const html = await res.text();
            const img = extractImage(html, facility.website_url);
            if (img) {
                facility.main_photo_url = img;
                return true;
            }
        }
    } catch (e) {
        // Fetch failed
    }

    // If we reach here, we couldn't get a photo. Clear dummy data if it exists.
    if (facility.main_photo_url && facility.main_photo_url.includes('unsplash.com')) {
        facility.main_photo_url = null;
        return true; // Modified
    }
    return false;
}

async function run() {
    console.log('--- 公式画像抽出処理 開始 ---');
    let modifiedCount = 0;
    let successCount = 0;

    // Concurrency limit
    const concurrency = 10;
    for (let i = 0; i < f.length; i += concurrency) {
        const batch = f.slice(i, i + concurrency);
        const results = await Promise.all(batch.map(processFacility));

        batch.forEach((facility, idx) => {
            if (results[idx]) {
                modifiedCount++;
                if (facility.main_photo_url) successCount++;
            }
        });
        if (i % 50 === 0) console.log(`Processed ${i} / ${f.length}...`);
    }

    fs.writeFileSync(dataPath, JSON.stringify(f, null, 2), 'utf8');
    console.log(`処理完了: ${modifiedCount}件の施設データを更新しました。`);
    console.log(`新規取得できた実画像数: ${successCount}件`);
}

run();
