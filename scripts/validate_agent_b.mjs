/**
 * エージェントB データ検証スクリプト
 * 全ファイルの整合性を確認する
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');

function loadJson(relPath) {
    const full = join(BASE, relPath);
    try {
        return JSON.parse(readFileSync(full, 'utf-8'));
    } catch (e) {
        return { error: e.message };
    }
}

let totalErrors = 0;
let totalChecks = 0;

function check(label, condition, detail = '') {
    totalChecks++;
    if (!condition) {
        console.log(`  ❌ ${label}${detail ? ': ' + detail : ''}`);
        totalErrors++;
    }
}

function validateFile(name, relPath, requiredFields, options = {}) {
    console.log(`\n--- ${name} ---`);
    const data = loadJson(relPath);

    if (data.error) {
        console.log(`  ❌ JSONパースエラー: ${data.error}`);
        totalErrors++;
        return;
    }

    check('有効なJSON配列', Array.isArray(data));
    console.log(`  件数: ${data.length}`);

    // IDの重複チェック
    const ids = data.map(d => d.id).filter(Boolean);
    const uniqueIds = new Set(ids);
    check('ID重複なし', ids.length === uniqueIds.size, `重複: ${ids.length - uniqueIds.size}件`);

    // dummyリンクチェック
    let dummyCount = 0;
    for (const item of data) {
        for (const [k, v] of Object.entries(item)) {
            if (typeof v === 'string' && v.includes('/dp/dummy')) {
                dummyCount++;
            }
        }
    }
    check('ダミーURL含まず', dummyCount === 0, `${dummyCount}件のダミーURL`);

    // color_variationsが配列であるかチェック（該当フィールドがある場合）
    if (options.checkColorArray) {
        let nonArrayCount = 0;
        for (const item of data) {
            if (item.color_variations !== undefined && !Array.isArray(item.color_variations)) {
                nonArrayCount++;
            }
        }
        check('color_variationsが全て配列', nonArrayCount === 0, `${nonArrayCount}件が配列でない`);
    }

    // ネスト構造がないかチェック
    if (options.checkNoNested) {
        let nestedCount = 0;
        for (const item of data) {
            if (item.items && Array.isArray(item.items)) {
                nestedCount++;
            }
        }
        check('ネスト構造(items[])なし', nestedCount === 0, `${nestedCount}件のネスト残存`);
    }

    // 必須フィールドチェック
    if (requiredFields.length > 0) {
        let missingCount = 0;
        for (const item of data) {
            for (const f of requiredFields) {
                if (item[f] === undefined) {
                    missingCount++;
                }
            }
        }
        check(`必須フィールド存在(${requiredFields.join(',')})`, missingCount === 0, `${missingCount}件のフィールド欠落`);
    }
}

console.log('========================================');
console.log('エージェントB データ検証レポート');
console.log('========================================');

// タスク1: パドル
validateFile('パドル (paddles.json)', 'gears/paddles.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true, checkNoNested: true });

// タスク2: シューズ
validateFile('シューズ (shoes.json)', 'gears/shoes.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true, checkNoNested: true });

// タスク3: ボール
validateFile('ボール (balls.json)', 'gears/balls.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true, checkNoNested: true });

// タスク4: アパレル
validateFile('アパレル (apparel.json)', 'gears/apparel.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true, checkNoNested: true });

// タスク5: バッグ
validateFile('バッグ (bags.json)', 'gears/bags.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true });

// タスク6: アクセサリー
validateFile('アクセサリー (accessories.json)', 'gears/accessories.json',
    ['id', 'brand_name', 'product_name'],
    { checkColorArray: true });

// タスク7: レビュー
validateFile('レビュー (expert_reviews.json)', 'players/expert_reviews.json',
    ['id', 'item_type', 'score', 'comment'], {});

// タスク8: ブランド
validateFile('ブランド (brands.json)', 'supplementary/brands.json',
    ['id', 'name', 'country', 'description', 'website_url'], {});

// タスク9: ニッチギア
validateFile('ニッチギア (niche_gears.json)', 'supplementary/niche_gears.json',
    ['id', 'category', 'name'], {});

// タスク10: タグマスタ
validateFile('タグマスタ (master_tags.json)', 'supplementary/master_tags.json',
    ['id', 'name', 'category', 'color_code'], {});

// タスク11: ブックマーク
validateFile('ブックマーク (user_bookmarks.json)', 'supplementary/user_bookmarks.json',
    ['id', 'user_id', 'item_type', 'item_id'], {});

// タスク12: ユーザーモック
validateFile('ユーザーモック (users_mock.json)', 'supplementary/users_mock.json',
    ['id', 'nickname', 'generation', 'estimated_level'], {});

console.log('\n========================================');
console.log(`検証結果: ${totalChecks}項目中、${totalErrors}件のエラー`);
if (totalErrors === 0) {
    console.log('✅ 全チェック通過！');
} else {
    console.log('⚠️ エラーあり。上記を確認してください。');
}
console.log('========================================');
