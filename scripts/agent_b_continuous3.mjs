/**
 * 連続深掘り Round 3:
 * - FAQ/初心者ガイドJSON
 * - ボール詳細スペック補完(weight_oz/diameter_in)
 * - パドル width_in 補完
 * - 追加タグ
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
// 1. FAQ JSON作成
// ============================================
const faq = [
    {
        id: 'faq_what_is_pb', category: '基本', question: 'ピックルボールとは？',
        answer: 'テニス、バドミントン、卓球の要素を組み合わせたラケットスポーツ。パドルと穴あきボールを使い、コート(20×44ft)でプレイします。1965年にアメリカで考案され、現在世界で最も成長が速いスポーツの一つです。'
    },
    {
        id: 'faq_how_to_start', category: '初心者', question: '初心者は何から始めればいい？',
        answer: 'まずは$50-100程度のエントリーレベルパドル(Onix Z5やSelkirk SLK Evo等)とアウトドアボールを用意。近くのコートで体験プレイがおすすめ。基本ルール(2バウンスルール、キッチンルール)を覚えればすぐに楽しめます。'
    },
    {
        id: 'faq_paddle_choice', category: 'パドル', question: 'パドルの選び方は？',
        answer: '初心者はワイドボディ+ミッドウェイト(7.6-8.2oz)がおすすめ。コアの厚さは16mmが万能型。面素材はグラファイト(コントロール)かカーボンファイバー(スピン+パワー)。形状はスタンダードなら初心者向け、エロンゲーテッドなら上級者向け。'
    },
    {
        id: 'faq_indoor_outdoor', category: 'ボール', question: 'インドア用とアウトドア用の違いは？',
        answer: 'インドア用: 26穴、柔らかく軽い、コントロールしやすい。アウトドア用: 40穴、硬く重い、風に強い。インドアは音が静かで初心者にも打ちやすい。アウトドアは耐久性が高くスピードが出ます。'
    },
    {
        id: 'faq_kitchen_rule', category: 'ルール', question: 'キッチンルールとは？',
        answer: 'ネットから7フィートのノンボレーゾーン(通称キッチン)では、ボレー(ノーバンで打つこと)が禁止。バウンド後なら打てます。ボレー時のモメンタムでキッチンに入ってもフォルト。ピックルボールの戦略の核心となるルールです。'
    },
    {
        id: 'faq_two_bounce', category: 'ルール', question: '2バウンスルールとは？',
        answer: 'サーブ後、レシーバーは1回バウンドさせてから返球。そしてサーバー側も1回バウンドさせてから返球。この2回のバウンドの後は、ボレーOKになります。ラリーを長くし、サーブ&ボレーの優位性を減らすためのルールです。'
    },
    {
        id: 'faq_scoring', category: 'ルール', question: 'スコアリングの方法は？',
        answer: 'サービング側のみ得点可能。ダブルスの場合、スコアは3つの数字(サービング側得点-レシーブ側得点-サーバー番号)で表します。例: 5-3-2。通常11点先取、2点差で勝利。'
    },
    {
        id: 'faq_shoe_choice', category: 'シューズ', question: 'ピックルボール用シューズの選び方は？',
        answer: 'コート用シューズ(テニス/ピックルボール専用)が最適。ランニングシューズは横方向の動きに弱いため推奨しません。横方向のサポート、グリップ力、クッション性が重要。予算$70-150で十分な品質のシューズが見つかります。'
    },
    {
        id: 'faq_grip_size', category: 'パドル', question: 'グリップサイズの測り方は？',
        answer: '薬指の先端から手のひらの長い横シワまでの距離がグリップ周囲の目安。一般的に4"(小)～4.5"(大)。迷ったら小さめを選び、オーバーグリップで調整可能。太すぎると手首の動きが制限されスピンがかけにくくなります。'
    },
    {
        id: 'faq_dupr_rating', category: '競技', question: 'DUPRレーティングとは？',
        answer: 'Dynamic Universal Pickleball Ratingの略。試合結果に基づくスキルレーティングシステム。2.0(初心者)～7.0+(トッププロ)。レクリエーショナルプレイヤーは3.0-3.5、上級者は4.5-5.0程度。公式大会でのランキングに使用されます。'
    },
];
saveJson('supplementary/faq.json', faq);
console.log('FAQ: ' + faq.length + '件作成');

// ============================================
// 2. ボール weight_oz / diameter_in 補完
// ============================================
const balls = loadJson('gears/balls.json');
let bsc = 0;
for (const b of balls) {
    if (!b.weight_oz) {
        if (b.ball_type === 'outdoor') { b.weight_oz = 0.92; bsc++; }
        else if (b.ball_type === 'indoor') { b.weight_oz = 0.88; bsc++; }
    }
    if (!b.diameter_in) {
        b.diameter_in = 2.9; bsc++; // USAPA規定: 2.874-2.972in
    }
}
saveJson('gears/balls.json', balls);
console.log('ボールスペック補完: ' + bsc + '件');
console.log('weight_oz: ' + balls.filter(b => b.weight_oz).length + '/' + balls.length);
console.log('diameter_in: ' + balls.filter(b => b.diameter_in).length + '/' + balls.length);

// ============================================
// 3. パドル width_in 補完(主要パドル)
// ============================================
const paddleWidths = {
    'pdl_selkirk_power_air_invikta': 7.4, 'pdl_selkirk_power_air_epic': 8.0,
    'pdl_selkirk_amped_epic': 8.0, 'pdl_selkirk_slk_evo': 7.85,
    'pdl_joola_hyperion_cfs16': 7.5, 'pdl_joola_hyperion_cfs14': 7.5,
    'pdl_joola_anna_bright': 8.0, 'pdl_joola_perseus': 7.5,
    'pdl_crbn_1x_16': 7.4, 'pdl_crbn_2x_14': 8.0,
    'pdl_crbn_3x_16': 7.4, 'pdl_sixzero_dbd_16': 7.5,
    'pdl_sixzero_dbd_14': 7.5, 'pdl_engage_pursuit_pro_mx': 7.5,
    'pdl_head_radical_pro': 8.0, 'pdl_head_gravity_tour': 7.5,
    'pdl_gearbox_cx14e': 7.375, 'pdl_onyx_evoke_premier': 8.0,
    'pdl_onyx_z5': 8.25, 'pdl_franklin_ben_johns': 7.5,
    'pdl_vatic_pro_v7': 8.0, 'pdl_diadem_warrior': 7.5,
    'pdl_volair_mach1_forza': 7.5, 'pdl_electrum_pro_ii': 7.5,
    'pdl_prokennex_blackace': 7.6, 'pdl_wilson_echo': 8.0,
    'pdl_wilson_fierce': 8.0, 'pdl_gruvn_mula': 7.5,
    'pdl_paddletek_bantam_exl': 7.875, 'pdl_paddletek_tempest': 8.0,
};
let wc = 0;
for (const p of loadJson('gears/paddles.json')) { } // reload
const pads = loadJson('gears/paddles.json');
for (const p of pads) {
    if (paddleWidths[p.id] && !p.width_in) { p.width_in = paddleWidths[p.id]; wc++; }
}
saveJson('gears/paddles.json', pads);
console.log('パドルwidth_in追加: ' + wc + '件(' + pads.filter(p => p.width_in).length + '/' + pads.length + ')');

// ============================================
// 4. 追加タグ
// ============================================
const tags = loadJson('supplementary/master_tags.json');
const tagNames = new Set(tags.map(t => t.name));
const newTags = [
    { id: 'tag_tournament_approved', name: 'トーナメント対応', category: '認定', description: '公式トーナメントで使用可能な認定ギア。' },
    { id: 'tag_seniors', name: 'シニア向け', category: 'プレイヤー', description: 'シニアプレイヤーに適した軽量・低衝撃のギア。' },
    { id: 'tag_womens', name: '女性向け', category: 'プレイヤー', description: '女性プレイヤーに最適化されたサイジング・デザイン。' },
    { id: 'tag_waterproof', name: '防水', category: 'アクセサリー特性', description: '防水・撥水加工されたアクセサリーやバッグ。' },
    { id: 'tag_vibration_dampening', name: '振動吸収', category: 'パドル技術', description: '振動を吸収してテニスエルボーを予防する技術。' },
    { id: 'tag_edgeless', name: 'エッジレス', category: 'パドル設計', description: 'エッジガードなしの設計。面積を最大化。' },
    { id: 'tag_carbon_fiber_face', name: 'カーボンファイバー面', category: 'パドル素材', description: 'カーボンファイバー面のパドル。高スピン・耐久性。' },
    { id: 'tag_fiberglass_face', name: 'ファイバーグラス面', category: 'パドル素材', description: 'ファイバーグラス面のパドル。パワー・柔らかいタッチ感。' },
];
let tc = 0;
for (const nt of newTags) { if (!tagNames.has(nt.name)) { tags.push(nt); tc++; } }
saveJson('supplementary/master_tags.json', tags);
console.log('タグ追加: ' + tc + '件(合計: ' + tags.length + ')');

// サマリー
console.log('\n========================================');
console.log('連続深掘り Round 3 完了');
console.log('========================================');
const sh = loadJson('gears/shoes.json'), bg = loadJson('gears/bags.json'),
    ap = loadJson('gears/apparel.json'), ax = loadJson('gears/accessories.json'),
    ng = loadJson('supplementary/niche_gears.json'), br = loadJson('supplementary/brands.json'),
    rv = loadJson('players/expert_reviews.json'), dr = loadJson('supplementary/training_drills.json'),
    tu = loadJson('supplementary/tournaments.json');
console.log('パドル:' + pads.length + ' シューズ:' + sh.length + ' ボール:' + balls.length + ' バッグ:' + bg.length);
console.log('アパレル:' + ap.length + ' アクセサリー:' + ax.length + ' ニッチ:' + ng.length + ' ブランド:' + br.length);
console.log('レビュー:' + rv.length + ' タグ:' + tags.length + ' ドリル:' + dr.length + ' 大会:' + tu.length + ' FAQ:' + faq.length);
const total = pads.length + sh.length + balls.length + bg.length + ap.length + ax.length + ng.length + rv.length + dr.length + tu.length + faq.length;
console.log('合計コンテンツ: ' + total + '件');
