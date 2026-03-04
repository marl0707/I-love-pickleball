const fs = require('fs');
const f = JSON.parse(fs.readFileSync('production_data/facilities/facilities.json', 'utf8'));

const photos = f.filter(x => x.main_photo_url && x.main_photo_url !== '');
const unsplash = photos.filter(x => x.main_photo_url.includes('unsplash.com'));
const nonUnsplash = photos.filter(x => !x.main_photo_url.includes('unsplash.com'));
const noPhoto = f.filter(x => !x.main_photo_url || x.main_photo_url === '');

console.log('--- 写真URL設定状況の詳細 ---');
console.log(`全施設数: ${f.length}`);
console.log(`写真URLあり: ${photos.length}`);
console.log(`  - Unsplash(ダミー推定): ${unsplash.length}`);
console.log(`  - Unsplash以外: ${nonUnsplash.length}`);
console.log(`写真URLなし(nullまたは空): ${noPhoto.length}`);

console.log('\n--- Unsplash以外のURL一覧 ---');
nonUnsplash.forEach(x => console.log(`- ${x.name}: ${x.main_photo_url}`));
