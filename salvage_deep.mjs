import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const pbDir = 'C:\\Users\\sejim\\.gemini\\antigravity\\conversations';
const baseDir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball';
const outDir = path.join(baseDir, 'salvaged_data_v2');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log('🔍 超深層サルベージ（パス非依存の全JSON無差別抽出）を開始します...');

let count = 0;
const files = fs.readdirSync(pbDir);

const savedHashes = new Set();

function saveParsedData(data, sourceMatchContext) {
    if (!data) return;
    if (Array.isArray(data) && data.length === 0) return;
    if (typeof data === 'object' && Object.keys(data).length === 0) return;

    // Convert to standard format
    const dataStr = JSON.stringify(data, null, 2);
    const hash = crypto.createHash('md5').update(dataStr).digest('hex');

    if (savedHashes.has(hash)) return;
    savedHashes.add(hash);

    // Try to guess filename from content
    let filename = `extracted_${hash.substring(0, 8)}.json`;
    const strFlat = JSON.stringify(data).toLowerCase();

    if (strFlat.includes('facility_id') || strFlat.includes('surface_type') || strFlat.includes('directions_url')) {
        filename = `facilities_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('brand_name') && strFlat.includes('paddle_shape')) {
        filename = `paddles_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('brand_name') && strFlat.includes('size_range')) {
        filename = `shoes_or_apparel_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('league_affiliation') || strFlat.includes('pro_')) {
        filename = `pro_players_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('target_audience') && strFlat.includes('article')) {
        filename = `articles_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('beginner_friendly') || strFlat.includes('community')) {
        filename = `community_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('skill_focus') && strFlat.includes('drill')) {
        filename = `drills_${hash.substring(0, 8)}.json`;
    } else if (strFlat.includes('entry_fee') && strFlat.includes('event')) {
        filename = `events_${hash.substring(0, 8)}.json`;
    }

    fs.writeFileSync(path.join(outDir, filename), dataStr, 'utf-8');
    console.log(`✅ 深層復元成功: ${filename} (サイズ: ${dataStr.length} bytes)`);
    count++;
}

for (const file of files) {
    if (!file.endsWith('.pb')) continue;

    let content = '';
    try {
        content = fs.readFileSync(path.join(pbDir, file)).toString('utf-8');
    } catch (e) { continue; }

    // 1. Markdown JSON blocks
    const mdRegex = /```json\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/g;
    let match;
    while ((match = mdRegex.exec(content)) !== null) {
        try {
            const data = JSON.parse(match[1]);
            saveParsedData(data, match[0].substring(0, 100));
        } catch (e) { }
    }

    // 2. CodeContent blocks
    const codeRegex = /"CodeContent"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    while ((match = codeRegex.exec(content)) !== null) {
        try {
            const unescaped = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\').replace(/\\t/g, '\t');
            // Try to parse as JSON
            const data = JSON.parse(unescaped);
            saveParsedData(data, match[0].substring(0, 100));
        } catch (e) {
            // Might not be JSON entirely. Let's see if there's JSON inside it.
            const innerUnescaped = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
            const innerMdRegex = /```json\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/g;
            let innerMatch;
            while ((innerMatch = innerMdRegex.exec(innerUnescaped)) !== null) {
                try {
                    const data2 = JSON.parse(innerMatch[1]);
                    saveParsedData(data2, innerMatch[0].substring(0, 100));
                } catch (e2) { }
            }
        }
    }

    // 3. Raw array blocks starting with id
    const rawArrayRegex = /\[\s*\{\s*"id"\s*:\s*"[^"]+"[\s\S]*?\}\s*\]/g;
    while ((match = rawArrayRegex.exec(content)) !== null) {
        try {
            const data = JSON.parse(match[0]);
            saveParsedData(data, match[0].substring(0, 100));
        } catch (e) { }
    }
}

console.log(`🚀 超深層サルベージ完了: 合計 ${count} 個のJSONブロックをパス非依存で強制復元しました。`);
