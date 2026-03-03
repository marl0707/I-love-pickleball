import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'price_guide.json');

let missingCount = 0;
let totalCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!data.facilities) continue;

        console.log(`\n--- ${file} ---`);
        for (const fac of data.facilities) {
            if (fac.type_flag === 1 || fac.type_flag === 3) {
                totalCount++;
                // Check if latitude/longitude is missing, null, or undefined
                if (fac.latitude == null || fac.longitude == null) {
                    missingCount++;
                    console.log(`- Missing: ${fac.name} | ${fac.address}`);
                }
            }
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e);
    }
}

console.log(`\nTotal Facilities (with courts): ${totalCount}`);
console.log(`Missing lat/lng: ${missingCount}`);
