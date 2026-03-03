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

        // console.log(`\n--- ${file} ---`);
        for (const fac of data.facilities) {
            if (fac.type_flag === 1 || fac.type_flag === 3) {
                totalCount++;
                // Check if hours are missing (assuming if hours_mon is empty/missing, the rest are likely too)
                if (!fac.hours_mon && !fac.hours_tue && !fac.hours_wed && !fac.hours_thu && !fac.hours_fri && !fac.hours_sat && !fac.hours_sun && !fac.hours_note) {
                    missingCount++;
                    // console.log(`- Missing Hours: ${fac.name}`);
                }
            }
        }
    } catch (e) { }
}

console.log(`\nTotal Facilities: ${totalCount}`);
console.log(`Completely Missing Hours: ${missingCount}`);
