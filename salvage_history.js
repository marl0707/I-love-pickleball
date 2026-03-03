const fs = require('fs');
const path = require('path');

const pbDir = 'C:\\Users\\sejim\\.gemini\\antigravity\\conversations';
const baseDir = 'c:\\Users\\sejim\\OneDrive\\デスクトップ\\Ronshoal_Tech_Base\\02_Development\\I-love-pickleball';

console.log('🔍 会話履歴（.pbファイル）全体からのサルベージを開始します...');

let count = 0;
const files = fs.readdirSync(pbDir);

for (const file of files) {
    if (!file.endsWith('.pb')) continue;

    let content = '';
    try {
        // 巨大なバイナリファイルなので Buffer文字列化でざっくり取得
        content = fs.readFileSync(path.join(pbDir, file)).toString('utf-8');
    } catch (e) { continue; }

    // JSONパスの痕跡を抽出
    const regex = /data[\\\/](pro_players|gears|drills|events|coaches|paddles|shoes|balls|apparel|bags|accessories)[\\\/][a-zA-Z0-9_\-]+\.json/g;
    let match;

    // 復元済みのパスを追跡（重複回避）
    let restoredPaths = new Set();

    while ((match = regex.exec(content)) !== null) {
        const relPath = match[0].replace(/\//g, '\\');
        if (restoredPaths.has(relPath)) continue;

        const startIdx = match.index;
        // 後ろ数万文字をスキャン対象とする
        const window = content.substr(startIdx, 50000);

        let restored = false;
        const jsonMatch = window.match(/```json\s*(\[\s*\{[\s\S]*?\}\s*\])\s*```/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                const outPath = path.join(baseDir, relPath);
                fs.mkdirSync(path.dirname(outPath), { recursive: true });
                fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
                console.log(`✅ 復元成功 (Markdown形式): ${relPath}`);
                count++;
                restoredPaths.add(relPath);
                restored = true;
            } catch (e) { }
        }

        if (!restored) {
            // write_to_file ツールの CodeContent 内部の形式
            const codeMatch = window.match(/"CodeContent"\s*:\s*"(\[\s*\\n\s*\{\\n[\s\S]*?(?:\}\\n\s*\]))"/);
            if (codeMatch) {
                try {
                    const unescaped = codeMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
                    const data = JSON.parse(unescaped);
                    const outPath = path.join(baseDir, relPath);
                    fs.mkdirSync(path.dirname(outPath), { recursive: true });
                    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
                    console.log(`✅ 復元成功 (CodeContent形式): ${relPath}`);
                    count++;
                    restoredPaths.add(relPath);
                } catch (e) { }
            }
        }

        if (!restored) {
            // 配列ではなくただのオブジェクトの場合
            const singleObjMatch = window.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            if (singleObjMatch) {
                try {
                    const data = JSON.parse(singleObjMatch[1]);
                    const outPath = path.join(baseDir, relPath);
                    fs.mkdirSync(path.dirname(outPath), { recursive: true });
                    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
                    console.log(`✅ 復元成功 (単体Object形式): ${relPath}`);
                    count++;
                    restoredPaths.add(relPath);
                } catch (e) { }
            }
        }
    }
}
console.log(`🚀 サルベージ完了: ${count} 個のJSONファイルを会話履歴から強制復元しました。`);
