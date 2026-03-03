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
                if (!fac.facility_courts) {
                    fac.facility_courts = [];
                }

                // If empty, add a default depending on indoors/outdoors
                if (fac.facility_courts.length === 0) {
                    const type = fac.court_type || (fac.operator_type?.includes('自治体') ? 'インドア' : '不明');
                    fac.facility_courts.push({
                        court_type: type,
                        number_of_courts: null,
                        surface_type: type === 'インドア' ? '体育館床(木製)' : '不明',
                        line_visibility: '他競技混在(見にくい)',
                        net_type: 'ポータブル等',
                        has_ac: 0,
                        lighting_type: type === 'インドア' ? '屋内照明' : null
                    });
                    modified = true;
                    updatedCount++;
                } else {
                    for (let i = 0; i < fac.facility_courts.length; i++) {
                        const c = fac.facility_courts[i];
                        if (!c.surface_type) {
                            c.surface_type = c.court_type === 'インドア' ? '体育館床(木製)' : '不明';
                            modified = true;
                        }
                        if (!c.net_type) {
                            c.net_type = 'ポータブル等';
                            modified = true;
                        }
                        if (!c.line_visibility) {
                            c.line_visibility = '不明';
                            modified = true;
                        }
                        // Count updates
                        if (modified) updatedCount++;
                    }
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        }
    } catch (e) {
    }
}

console.log(`\nUpdated/Enriched facility_courts for ${updatedCount} facilities.`);
