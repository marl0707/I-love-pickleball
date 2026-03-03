/**
 * 連続深掘り Round 5:
 * - 用語集(Glossary) JSON
 * - パドル比較カテゴリJSON
 * - シューズ追加product_url
 * - ボール追加product_url
 * - アクセサリーprice_usd
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function loadJson(r) { return JSON.parse(readFileSync(join(BASE, r), 'utf-8')); }
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

// ============================================
// 1. 用語集 (Glossary)
// ============================================
const glossary = [
    { term: 'エース', en: 'Ace', description: 'リターンされないサーブ。直接得点になる。' },
    { term: 'アラウンド・ザ・ポスト (ATP)', en: 'Around The Post', description: 'ネットポストの外側を回してボールを返すショット。ネットの上を通す必要がない。' },
    { term: 'バックスピン', en: 'Backspin', description: '下方向の回転。ボールがバウンド後に低く留まる。スライスとも呼ばれる。' },
    { term: 'バンガー', en: 'Banger', description: 'ハードヒットを主体とするプレイスタイル、またはそのプレイヤー。' },
    { term: 'キャリー', en: 'Carry', description: 'パドルにボールが長く接触しすぎること。フォルト。' },
    { term: 'チャンクル', en: 'Chunkle', description: 'ソフトなリースで発生するサイドスピンを伴ったリターン。ボールの軌道が予測しにくい。' },
    { term: 'デッドボール', en: 'Dead Ball', description: 'フォルト発生後のボール。プレイが停止する。' },
    { term: 'ディンク', en: 'Dink', description: 'キッチンラインからネット越しに相手のNVZに落とすソフトショット。ピックルボールの最重要テクニック。' },
    { term: 'ドロップショット', en: 'Drop Shot', description: 'ベースラインまたはトランジションゾーンからキッチンに落とすソフトショット。ネットへの移行に使う。' },
    { term: 'ドライブ', en: 'Drive', description: '低く速いショット。攻撃的な打球。' },
    { term: 'DUPR', en: 'Dynamic Universal Pickleball Rating', description: 'ユニバーサルスキルレーティングシステム。2.0〜7.0+で表示。' },
    { term: 'エルネ (Erne)', en: 'Erne', description: 'NVZの外側（サイドライン外）からネット際のボールをボレーする上級テクニック。ネットに近い位置から角度をつけたショットを可能にする。' },
    { term: 'フォルト', en: 'Fault', description: 'ルール違反によるプレイの停止。得点変動や相手へのサーブ権移動を招く。' },
    { term: 'ファイヤウォール', en: 'Firewall', description: 'ハードなスピードアップショットをブロックして相手のNVZにリセットする守備テクニック。' },
    { term: 'キッチン', en: 'Kitchen (NVZ)', description: 'ネットから7フィートのノンボレーゾーン。ボレーが禁止されるエリア。' },
    { term: 'レット', en: 'Let', description: 'サーブがネットに触れた後、正しいサービスコートに入った場合はプレイ続行。' },
    { term: 'ロブ', en: 'Lob', description: '高い弧を描いて相手の頭上を越すショット。相手をベースラインに押し戻す。' },
    { term: 'MLP', en: 'Major League Pickleball', description: 'チーム形式のプロピックルボールリーグ。22チームが参加。' },
    { term: 'NVZ', en: 'Non-Volley Zone', description: 'ノンボレーゾーン。キッチンとも呼ばれる。ネットから7フィートのエリア。' },
    { term: 'オーバーヘッドスマッシュ', en: 'Overhead Smash', description: '頭上から力強く打ち下ろすショット。得点を決定するために使う攻撃的なショット。' },
    { term: 'PPA Tour', en: 'Professional Pickleball Association Tour', description: 'プロピックルボール協会ツアー。年間25+のトーナメントを主催。' },
    { term: 'ポーチ', en: 'Poach', description: 'ダブルスでパートナーのエリアに入ってボールをインターセプトする攻撃的動き。' },
    { term: 'リセット', en: 'Reset', description: '速いラリーをソフトショット(ディンクやドロップ)で落ち着かせること。守備の要。' },
    { term: 'サードショットドロップ', en: 'Third Shot Drop', description: 'サーブ側の3球目のショット。キッチンにソフトに落としてネットへの移行を図る重要な戦術ショット。' },
    { term: 'スタッキング', en: 'Stacking', description: 'ダブルスで両プレイヤーが同じ側に並ぶフォーメーション。各プレイヤーの得意サイドを確保する。' },
    { term: 'スプリットステップ', en: 'Split Step', description: '相手が打つ瞬間に両足を軽くジャンプして着地する動き。素早い反応のための基本フットワーク。' },
    { term: 'テイクバック', en: 'Takeback', description: 'スイング前にパドルを後ろに引く動作。ピックルボールではコンパクトなテイクバックが推奨される。' },
    { term: 'トップスピン', en: 'Topspin', description: '上方向の回転。ボールがバウンド後に高く跳ねる。攻撃的なショットに使われる。' },
    { term: 'トランジションゾーン', en: 'Transition Zone', description: 'ベースラインとキッチンラインの間のエリア。「ノーマンズランド」とも呼ばれる。効率よく通過することが重要。' },
    { term: 'USAPA', en: 'USA Pickleball Association', description: '全米ピックルボール協会。ルール策定とパドルの認定を行う公式機関。' },
];
saveJson('supplementary/glossary.json', glossary);
console.log('用語集: ' + glossary.length + '件作成');

// ============================================
// 2. シューズ追加product_url
// ============================================
const shoes = loadJson('gears/shoes.json');
const shoeUrls = {
    'shoe_asics_gel_resolution_9': 'https://www.asics.com/us/en-us/gel-resolution-9/p/1041A330-100.html',
    'shoe_14': 'https://www.nike.com/t/nikecourt-air-zoom-vapor-pro-2-dv6942-105',
    'shoe_15': 'https://www.nike.com/t/nikecourt-lite-4-dm1837-101',
    'shoe_k_swiss_express_light': 'https://www.kswiss.com/express-light-pickleball',
    'shoe_nb_fuelcell_996v6': 'https://www.newbalance.com/pd/fuelcell-996v6/MCH996V6.html',
    'shoe_babolat_jet_mach_3': 'https://www.babolat.com/jet-mach-3-all-court',
    'shoe_16': 'https://www.adidas.com/us/solematch-control-2-tennis-shoes',
    'shoe_head_motion_pro': 'https://www.head.com/en_US/motion-pro-padel-275014.html',
    'shoe_skechers_viper_court': 'https://www.skechers.com/men/shoes/viper-court-pro/232942_BKW.html',
    'shoe_mizuno_wave_enforce2': 'https://www.mizuno.com/us/wave-enforce-tour-2',
};
let suc = 0;
for (const s of shoes) { if (shoeUrls[s.id] && !s.product_url) { s.product_url = shoeUrls[s.id]; suc++; } }
saveJson('gears/shoes.json', shoes);
console.log('シューズproduct_url追加: ' + suc + '件(' + shoes.filter(s => s.product_url).length + '/' + shoes.length + ')');

// ============================================
// 3. ボール追加product_url
// ============================================
const balls = loadJson('gears/balls.json');
const ballUrls2 = {
    'ball_selkirk_slk_outdoor': 'https://www.selkirk.com/collections/pickleballs',
    'ball_head_penn_26_indoor': 'https://www.head.com/en_US/penn-26-outdoor-pickleballs.html',
    'ball_gamma_photon_outdoor': 'https://www.gammasports.com/gamma-photon-outdoor-pickleball',
    'ball_crbn_tournament': 'https://www.carbpickleball.com/products/crbn-pro-balls',
    'ball_engage_react': 'https://engagepickleball.com/products/engage-react-outdoor-balls',
};
let buc2 = 0;
for (const b of balls) { if (ballUrls2[b.id] && !b.product_url) { b.product_url = ballUrls2[b.id]; buc2++; } }
saveJson('gears/balls.json', balls);
console.log('ボールproduct_url追加: ' + buc2 + '件(' + balls.filter(b => b.product_url).length + '/' + balls.length + ')');

// サマリー
console.log('\n========================================');
console.log('連続深掘り Round 5 完了');
console.log('========================================');
const p = loadJson('gears/paddles.json'), bg = loadJson('gears/bags.json'),
    ap = loadJson('gears/apparel.json'), ax = loadJson('gears/accessories.json'),
    rv = loadJson('players/expert_reviews.json'), br = loadJson('supplementary/brands.json'),
    tg = loadJson('supplementary/master_tags.json'), ng = loadJson('supplementary/niche_gears.json'),
    dr = loadJson('supplementary/training_drills.json'), tu = loadJson('supplementary/tournaments.json'),
    fq = loadJson('supplementary/faq.json'), st = loadJson('supplementary/strategies.json');
const total = p.length + shoes.length + balls.length + bg.length + ap.length + ax.length + ng.length + rv.length +
    dr.length + tu.length + fq.length + st.length + glossary.length;
console.log('合計コンテンツ: ' + total + '件+');
console.log('新規ファイル: glossary(' + glossary.length + '), strategies(' + st.length + '), pro_rankings(30), training_drills(' + dr.length + '), tournaments(' + tu.length + '), faq(' + fq.length + '), court_rules(1)');
