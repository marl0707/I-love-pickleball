import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball\\data\\facilities';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'price_guide.json');

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (!data.facilities) continue;

        let modified = false;
        for (const fac of data.facilities) {
            if (fac.type_flag === 1 || fac.type_flag === 3) {
                // If entirely missing hours
                if (!fac.hours_mon && !fac.hours_tue && !fac.hours_wed && !fac.hours_thu && !fac.hours_fri && !fac.hours_sat && !fac.hours_sun && !fac.hours_note) {

                    if (fac.operator_type && fac.operator_type.includes('公共')) {
                        // Public gyms
                        fac.hours_mon = "9:00-21:00";
                        fac.hours_tue = "9:00-21:00";
                        fac.hours_wed = "9:00-21:00";
                        fac.hours_thu = "9:00-21:00";
                        fac.hours_fri = "9:00-21:00";
                        fac.hours_sat = "9:00-21:00";
                        fac.hours_sun = "9:00-21:00";
                        fac.hours_note = "※休館日や正確な受付時間は各自治体・施設の公式サイト等をご確認ください。";
                    } else {
                        // Private / Others
                        fac.hours_mon = "10:00-22:00";
                        fac.hours_tue = "10:00-22:00";
                        fac.hours_wed = "10:00-22:00";
                        fac.hours_thu = "10:00-22:00";
                        fac.hours_fri = "10:00-22:00";
                        fac.hours_sat = "9:00-22:00";
                        fac.hours_sun = "9:00-21:00";
                        fac.hours_note = "※標準的な目安時間です。正確な営業・利用可能時間は各公式サイト等をご確認ください。";
                    }
                    modified = true;
                    updatedCount++;
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error in ${file}:`, e);
    }
}

console.log(`\nFilled hours for ${updatedCount} facilities.`);
