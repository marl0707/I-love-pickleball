import fs from 'fs';
import path from 'path';

const DATA_DIR = 'data';
const SALVAGED_DIR = 'salvaged_data';

function loadJson(p) {
    if (!fs.existsSync(p)) return [];
    try {
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) {
            return typeof data === 'object' && data !== null ? [data] : [];
        }
        return data;
    } catch (e) {
        console.error(`Error loading ${p}:`, e.message);
        return [];
    }
}

function saveJson(p, data) {
    fs.writeFileSync(p, JSON.stringify(data, null, 4), 'utf-8');
}

function mergeListsById(list1, list2) {
    const merged = new Map();

    // list1 = base
    for (const item of list1) {
        if (typeof item === 'object' && item !== null) {
            const key = item.id || JSON.stringify(item);
            merged.set(key, item);
        }
    }

    // list2 = incoming
    for (const item of list2) {
        if (typeof item === 'object' && item !== null) {
            const key = item.id || JSON.stringify(item);
            if (merged.has(key)) {
                // Merge fields
                const existing = merged.get(key);
                for (const [k, v] of Object.entries(item)) {
                    if (existing[k] === undefined) {
                        existing[k] = v;
                    }
                }
            } else {
                merged.set(key, item);
            }
        }
    }

    return Array.from(merged.values());
}

function processFile(srcName, destDir, destName) {
    if (!destName) destName = srcName;

    const srcPath = path.join(SALVAGED_DIR, srcName);
    const destDirPath = path.join(DATA_DIR, destDir);
    const destPath = path.join(destDirPath, destName);

    if (!fs.existsSync(srcPath)) return;

    if (!fs.existsSync(destDirPath)) {
        fs.mkdirSync(destDirPath, { recursive: true });
    }

    const srcData = loadJson(srcPath);

    if (fs.existsSync(destPath)) {
        const destData = loadJson(destPath);
        const merged = mergeListsById(destData, srcData);
        saveJson(destPath, merged);
        console.log(`Merged ${srcName} into ${destDir}/${destName}`);
    } else {
        saveJson(destPath, srcData);
        console.log(`Copied ${srcName} to ${destDir}/${destName}`);
    }
}

// Mappings
const mappings = [
    ['activity_logs.json', 'community'],
    ['announcements.json', 'community'],
    ['apparel_and_bags.json', 'gears', 'apparel_and_bags.json'],
    ['awards.json', 'events'],
    ['drills_beginner_intermediate.json', 'drills', 'drills_master.json'],
    ['dummy_communities.json', 'community', 'communities.json'],
    ['dummy_threads.json', 'community', 'threads.json'],
    ['dummy_users.json', 'community', 'users.json'],
    ['expert_reviews.json', 'reviews'],
    ['glossary.json', 'articles'],
    ['promotions_coupons.json', 'events'],
    ['tournaments_comprehensive.json', 'events', 'tournaments_and_events.json']
];

for (const [src, dDir, dName] of mappings) {
    processFile(src, dDir, dName || src);
}

// Gear -> Gears Merge
const gearDir = path.join(DATA_DIR, 'gear');
const gearsDir = path.join(DATA_DIR, 'gears');
if (fs.existsSync(gearDir)) {
    if (!fs.existsSync(gearsDir)) fs.mkdirSync(gearsDir, { recursive: true });

    for (const f of fs.readdirSync(gearDir)) {
        if (f.endsWith('.json')) {
            const srcP = path.join(gearDir, f);
            const destP = path.join(gearsDir, f);
            const d1 = loadJson(srcP);
            const d2 = loadJson(destP);
            const m = mergeListsById(d2, d1);
            saveJson(destP, m);
            console.log(`Merged gear/${f} into gears/${f}`);
        }
    }
}

console.log("Merge completed.");
