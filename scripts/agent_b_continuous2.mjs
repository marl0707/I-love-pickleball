/**
 * 連続深掘り Round 2:
 * - パドル残り8件 length_in/grip補完
 * - トレーニングドリル情報JSON作成
 * - トーナメント情報JSON作成
 * - パドル追加product_url
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
// 1. パドル残り8件 length_in + grip_length_in
// ============================================
const paddles = loadJson('gears/paddles.json');
const pSpec = {
    'paddle_franklin_signature_14': { length_in: 16.0, grip_length_in: 5.5 },
    'paddle_selkirk_vanguard_16': { length_in: 16.4, grip_length_in: 5.25 },
    'paddle_crbn_1x_14': { length_in: 16.5, grip_length_in: 5.5 },
    'paddle_sixzero_dbd_16': { length_in: 16.0, grip_length_in: 5.5 },
    'pdl_electrum_elite': { length_in: 16.5, grip_length_in: 5.5 },
    'pdl_sixzero_coral': { length_in: 16.0, grip_length_in: 5.5 },
    'pdl_sixzero_bd_16': { length_in: 16.0, grip_length_in: 5.5 },
    'pdl_prokennex_blackace': { length_in: 15.8, grip_length_in: 5.25 },
};
let lc = 0, gc = 0;
for (const p of paddles) {
    const s = pSpec[p.id];
    if (s) {
        if (!p.length_in && s.length_in) { p.length_in = s.length_in; lc++; }
        if (!p.grip_length_in && s.grip_length_in) { p.grip_length_in = s.grip_length_in; gc++; }
    }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルlength追加:' + lc + '件(' + paddles.filter(p => p.length_in).length + '/' + paddles.length + ')');
console.log('パドルgrip追加:' + gc + '件(' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length + ')');

// ============================================
// 2. トレーニングドリル情報JSON
// ============================================
const drills = [
    {
        id: 'drill_paddle_tap', level: '初心者', name: 'パドルタップドリル', category: 'パドルコントロール',
        description: 'ボールをパドルで繰り返し弾ませる。フォアハンドとバックハンドを交互に。歩きながらやると難易度UP。',
        duration_min: 5, players_needed: 1
    },
    {
        id: 'drill_wall_rally', level: '初心者', name: 'ウォールラリー', category: '基礎練習',
        description: '壁に向かってフォアハンド/バックハンドのストロークを打つ。ネット高さにテープを貼って実戦シミュレーション。',
        duration_min: 10, players_needed: 1
    },
    {
        id: 'drill_dink_practice', level: '初心者', name: 'ディンク練習', category: 'ソフトゲーム',
        description: 'パートナーとキッチンラインでディンクの打ち合い。ボールを低く保ち、相手のNVZ内にコントロール。',
        duration_min: 10, players_needed: 2
    },
    {
        id: 'drill_serve_target', level: '初心者', name: 'サーブターゲット', category: 'サーブ',
        description: 'コートの特定の場所にマーカーを置き、サーブの精度を磨く。深さと左右のコントロールを意識。',
        duration_min: 10, players_needed: 1
    },
    {
        id: 'drill_triangle_dinks', level: '中級者', name: 'トライアングルディンク', category: 'ソフトゲーム',
        description: '3つのマーカーを使い、三角形パターンでディンクを打ち分ける。ショットプレースメントとプレッシャー下のコントロールを磨く。',
        duration_min: 15, players_needed: 2
    },
    {
        id: 'drill_crosscourt_dink', level: '中級者', name: 'クロスコートディンク', category: 'ソフトゲーム',
        description: 'ネット越しに対角線上にソフトなディンクを打ち合う。角度とコントロール、忍耐力を養う。ゲーム形式で0点リセットも有効。',
        duration_min: 15, players_needed: 2
    },
    {
        id: 'drill_serve_volley', level: '中級者', name: 'サーブ&ボレー', category: '攻撃',
        description: 'サーブ後すぐにネットに詰め、リターンをボレーで返す。フットワークとネットポジショニングを磨く。',
        duration_min: 15, players_needed: 2
    },
    {
        id: 'drill_blocking', level: '中級者', name: 'ブロッキングドリル', category: '守備',
        description: '速いショットをオープンなパドル面、緩いグリップ、体に近い打点で吸収する練習。パンチフォワードはしない。',
        duration_min: 10, players_needed: 2
    },
    {
        id: 'drill_slinky_drop', level: '中級者', name: 'スリンキードロップ', category: 'サードショット',
        description: 'キッチンラインからディンク→2歩下がってドロップ→さらに2歩下がって…ベースラインまで。距離が増すごとにフォロースルーを大きく。',
        duration_min: 15, players_needed: 2
    },
    {
        id: 'drill_0_to_60', level: '中級者', name: '0 to 60ドリル', category: 'サードショット',
        description: 'NVZの相手がフィードしたボールをベースラインからドロップ。連続成功で得点、ミスでチェンジ。累計60点を目指す。',
        duration_min: 20, players_needed: 2
    },
    {
        id: 'drill_crosscourt_grinder', level: '上級者', name: 'クロスコートグラインダー', category: '総合',
        description: '対角線上で全ラリーをプレイ。精度、スタミナ、タイトアングルのプレイを磨く上級者向けドリル。',
        duration_min: 20, players_needed: 2
    },
    {
        id: 'drill_dink_lob_combo', level: '上級者', name: 'ディンク&ロブコンボ', category: '攻守転換',
        description: 'ディンクからランダムにロブを混ぜる。ソフトプレイとアグレッシブプレイの切り替え、デセプション技術を磨く。',
        duration_min: 15, players_needed: 2
    },
    {
        id: 'drill_rapid_volley', level: '上級者', name: 'ラピッドファイアボレー', category: '反射',
        description: 'ネットで高速ボレーの打ち合い。反射神経、反応速度、ネットプレゼンスを強化する上級者向けドリル。',
        duration_min: 10, players_needed: 2
    },
];
saveJson('supplementary/training_drills.json', drills);
console.log('トレーニングドリル: ' + drills.length + '件作成');

// ============================================
// 3. トーナメント情報JSON
// ============================================
const tournaments = [
    {
        id: 'tour_ppa_masters', name: 'PPA Tour Masters', organization: 'PPA',
        location: 'Rancho Mirage, CA', date: '2025-01-06', tier: 'マスターズ',
        description: 'PPA Tourシーズン開幕戦。プロピックルボールの最高峰トーナメント。'
    },
    {
        id: 'tour_ppa_australia', name: 'PPA Australia Open', organization: 'PPA',
        location: 'Melbourne, Australia', date: '2025-01-30', tier: 'オープン',
        description: 'PPA Tour初のオーストラリア開催。ピックルボールのグローバル展開を象徴するイベント。'
    },
    {
        id: 'tour_us_open', name: 'US Open Pickleball Championships', organization: 'USA Pickleball',
        location: 'Naples, FL', date: '2025-04-26', tier: 'メジャー',
        description: '「世界最大のピックルボールパーティー」と呼ばれる大会。プロからアマまで参加。年に一度のフロリダ開催。'
    },
    {
        id: 'tour_mlp_midseason', name: 'MLP Mid-Season Tournament', organization: 'MLP',
        location: 'Grand Rapids, MI', date: '2025-07-10', tier: 'メジャー',
        prize_pool_usd: 100000,
        description: 'MLP全22チームが参加するミッドシーズントーナメント。Beer City Openと同時開催。プレミア優勝$50,000。'
    },
    {
        id: 'tour_mlp_cup', name: 'MLP Cup', organization: 'MLP',
        location: 'Dallas, TX', date: '2025-10-31', tier: 'カップ',
        description: 'MLP単独イベント。World Championships開幕戦としてダラスで開催。'
    },
    {
        id: 'tour_ppa_worlds', name: 'PPA World Championships', organization: 'PPA/UPA',
        location: 'Dallas, TX', date: '2025-11-15', tier: 'ワールド',
        description: 'PPA Tour最高峰。3000ポイント獲得のワールドチャンピオンシップ。ダブルス優勝$90,000。'
    },
    {
        id: 'tour_usap_nationals', name: 'USA Pickleball National Championships', organization: 'USA Pickleball',
        location: 'Mesa, AZ', date: '2025-11-15', tier: 'ナショナル',
        description: '全米チャンピオンシップ。「Golden Ticket」イベントで予選通過が必要。'
    },
];
saveJson('supplementary/tournaments.json', tournaments);
console.log('トーナメント情報: ' + tournaments.length + '件作成');

// ============================================
// 4. 追加 product_url (パドル残り)
// ============================================
const paddleUrlsExtra = {
    'pdl_prokennex_blackace': 'https://prokennex.com/products/black-ace-pro',
    'pdl_wilson_echo': 'https://www.wilson.com/en-us/product/echo-energy-wr098911u',
    'pdl_wilson_fierce': 'https://www.wilson.com/en-us/product/fierce-max-paddle',
    'pdl_wilson_profile': 'https://www.wilson.com/en-us/product/profile-pro-paddle',
    'pdl_kswiss_hypercourt': 'https://www.kswiss.com/pickleball-paddles',
    'pdl_big_dill_relish': 'https://bigdillpickleball.com/products/relish-paddle',
    'pdl_bigdill_original': 'https://bigdillpickleball.com/products/original-paddle',
    'pdl_niupipo_explorer': 'https://niupipo.com/products/explorer-pro',
    'pdl_vinsguir_carbon': 'https://www.amazon.com/dp/B0BQY5Y9F8',
    'pdl_amazin_aces': 'https://www.amazon.com/dp/B07MR94VQR',
};
let puc = 0;
for (const p of paddles) {
    if (paddleUrlsExtra[p.id] && !p.product_url) { p.product_url = paddleUrlsExtra[p.id]; puc++; }
}
saveJson('gears/paddles.json', paddles);
console.log('パドルproduct_url追加:' + puc + '件(' + paddles.filter(p => p.product_url).length + '/' + paddles.length + ')');

// サマリー
console.log('\n========================================');
console.log('連続深掘り Round 2 完了');
console.log('========================================');
const sh = loadJson('gears/shoes.json'), bl = loadJson('gears/balls.json'), bg = loadJson('gears/bags.json'),
    ap = loadJson('gears/apparel.json'), ax = loadJson('gears/accessories.json'),
    ng = loadJson('supplementary/niche_gears.json'), br = loadJson('supplementary/brands.json'),
    rv = loadJson('players/expert_reviews.json'), tg = loadJson('supplementary/master_tags.json');
console.log('パドル:' + paddles.length + ' シューズ:' + sh.length + ' ボール:' + bl.length + ' バッグ:' + bg.length);
console.log('アパレル:' + ap.length + ' アクセサリー:' + ax.length + ' ニッチ:' + ng.length + ' ブランド:' + br.length);
console.log('レビュー:' + rv.length + ' タグ:' + tg.length + ' ドリル:' + drills.length + ' 大会:' + tournaments.length);
console.log('パドルlength:' + paddles.filter(p => p.length_in).length + '/' + paddles.length);
console.log('パドルgrip:' + paddles.filter(p => p.grip_length_in).length + '/' + paddles.length);
console.log('product_url: パドル' + paddles.filter(p => p.product_url).length + ' シューズ' + sh.filter(s => s.product_url).length);
