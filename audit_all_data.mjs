// 全データソースの監査スクリプト - レコード数、フィールド充足度を一括確認
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllJsonFiles(dir, prefix = '') {
    let results = [];
    try {
        const items = readdirSync(dir);
        for (const item of items) {
            const full = join(dir, item);
            const st = statSync(full);
            if (st.isDirectory()) {
                results = results.concat(getAllJsonFiles(full, prefix ? `${prefix}/${item}` : item));
            } else if (item.endsWith('.json')) {
                results.push({ path: full, rel: prefix ? `${prefix}/${item}` : item });
            }
        }
    } catch (e) { /* skip */ }
    return results;
}

function analyzeFile(filePath) {
    try {
        const raw = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
            const count = data.length;
            if (count === 0) return { records: 0, fields: [], nullRatio: {} };
            // フィールド分析
            const allFields = new Set();
            data.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(k => allFields.add(k));
                }
            });
            const fields = [...allFields];
            const nullRatio = {};
            for (const f of fields) {
                let nullCount = 0;
                for (const item of data) {
                    const v = item[f];
                    if (v === null || v === undefined || v === '' || v === 'null' || v === '不明' || v === 'N/A') {
                        nullCount++;
                    }
                }
                nullRatio[f] = Math.round((nullCount / count) * 100);
            }
            return { records: count, fields, nullRatio };
        } else if (typeof data === 'object') {
            // オブジェクト形式
            const keys = Object.keys(data);
            return { records: `obj(${keys.length}keys)`, fields: keys, nullRatio: {} };
        }
        return { records: 'unknown', fields: [], nullRatio: {} };
    } catch (e) {
        return { error: e.message };
    }
}

const BASE = 'c:/Users/sejim/OneDrive/デスクトップ/Ronshoal_Tech_Base/02_Development/I-love-pickleball';

const sources = [
    { name: 'production_data/', dir: join(BASE, 'production_data') },
];

for (const src of sources) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`【データソース】${src.name}`);
    console.log('='.repeat(80));

    const files = getAllJsonFiles(src.dir);
    for (const f of files) {
        const result = analyzeFile(f.path);
        if (result.error) {
            console.log(`  ${f.rel}: エラー - ${result.error}`);
            continue;
        }
        console.log(`  ${f.rel}: ${result.records}件`);
        if (result.nullRatio && typeof result.records === 'number' && result.records > 0) {
            const poorFields = Object.entries(result.nullRatio)
                .filter(([, ratio]) => ratio >= 50)
                .sort((a, b) => b[1] - a[1]);
            if (poorFields.length > 0) {
                console.log(`    → 欠損50%以上: ${poorFields.map(([f, r]) => `${f}(${r}%)`).join(', ')}`);
            }
        }
    }
}
