/**
 * 連続深掘り Round 6:
 * - ピックルボール歴史タイムラインJSON
 * - 健康効果JSON
 * - パドルテクノロジー解説JSON
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

// ============================================
// 1. ピックルボール歴史タイムライン
// ============================================
const history = {
    origin: {
        year: 1965, location: 'ベインブリッジ島, ワシントン州',
        founders: ['Joel Pritchard', 'Bill Bell', 'Barney McCallum'],
        description: '元州議会議員Joel Pritchardと友人たちが、退屈した家族のためにバドミントンコート、ピンポンパドル、ウィッフルボールを使って考案。'
    },
    name_origin: '「ピックルボート(pickle boat)」に由来。ボート競技で余ったオアズメンで構成されるクルーを指す。異なるスポーツの要素を組み合わせた特徴を表現。',
    timeline: [
        { year: 1965, event: 'ベインブリッジ島でピックルボール考案' },
        { year: 1967, event: '最初の常設コートがBill O\'Brian宅の裏庭に建設' },
        { year: 1968, event: 'Pickle Ball Inc.設立' },
        { year: 1972, event: 'スポーツの管理・保護のための法人設立' },
        { year: 1976, event: 'ワシントン州タクウィラで最初の公式トーナメント開催' },
        { year: 1984, event: 'USAPA(全米アマチュアピックルボール協会)設立。初の公式ルールブック発行。初の複合素材パドル登場' },
        { year: 1990, event: 'アメリカ全50州でプレイされるようになる' },
        { year: 2005, event: 'USAPAが非営利組織となる' },
        { year: 2009, event: '初のUSAPA全国トーナメント開催' },
        { year: 2016, event: '初のUS Open Pickleball ChampionshipsがCBS Sportsで放送' },
        { year: 2020, event: 'プレイヤー数420万人。COVID-19パンデミック中にアウトドアスポーツとして急成長' },
        { year: 2021, event: 'プレイヤー数482万人。「アメリカで最も成長の速いスポーツ」に認定(1年目)' },
        { year: 2022, event: 'プレイヤー数895万人(前年比86%増)。MLP(メジャーリーグピックルボール)発足' },
        { year: 2023, event: 'プレイヤー数1,358万人。PPA Tour拡大、プロ化加速' },
        { year: 2024, event: 'プレイヤー数1,980万人(前年比45.8%増)。全米68,000+コート。4年連続「最も成長の速いスポーツ」' },
        { year: 2025, event: 'プレイヤー数約2,270万人(推計)。平均年齢34.8歳に低下。UPA(PPA+MLP統合)による賞金総額$1,500万見込み' },
    ],
    growth_stats: {
        '2020': { players_million: 4.20 },
        '2021': { players_million: 4.82 },
        '2022': { players_million: 8.95 },
        '2023': { players_million: 13.58 },
        '2024': { players_million: 19.80 },
        '2025_projected': { players_million: 22.70 },
    },
};
saveJson('supplementary/history.json', history);
console.log('歴史タイムライン: 作成完了 (' + history.timeline.length + 'イベント)');

// ============================================
// 2. 健康効果JSON
// ============================================
const healthBenefits = {
    overview: 'ピックルボールはテニス、バドミントン、卓球の要素を組み合わせた低衝撃スポーツ。全年齢層に適しており、特にシニア層に人気。',
    calories_per_hour: {
        casual: { min: 250, max: 350, description: 'カジュアル/レクリエーショナルプレイ' },
        moderate: { min: 350, max: 450, description: '中程度の強度のダブルス' },
        intense: { min: 500, max: 700, description: '競技的なシングルス/激しいダブルス' },
        comparison: 'ウォーキングの同じ時間に比べて40%多くカロリーを消費'
    },
    physical_benefits: [
        { name: '心血管系の強化', description: '心拍数を上げる有酸素運動。血圧低下、コレステロール改善、心臓病・脳卒中リスク減少。' },
        { name: 'バランスと協調性の向上', description: '素早い動き、ハンドアイコーディネーション、正確な動作で神経筋機能を改善。転倒リスクを軽減。' },
        { name: '筋力と柔軟性の強化', description: '脚、腕、体幹を中心にさまざまな筋肉群を鍛え、筋力、パワー、持久力、柔軟性を向上。' },
        { name: '関節に優しい低衝撃スポーツ', description: 'テニスやランニングと比較して膝、腰、腰への負担が少ない。関節炎や骨粗鬆症のある方にも適している。' },
    ],
    mental_benefits: [
        { name: 'ストレス・不安の軽減', description: 'エンドルフィン放出でストレス、不安、うつ症状を緩和。' },
        { name: '認知機能の維持', description: '戦略的思考が脳を活性化し、認知機能や記憶力を維持・向上。' },
        { name: '社会的つながり', description: 'コミュニティ活動やダブルスのパートナーとの交流で孤独感を解消し、幸福感を向上。' },
    ],
    joint_friendly_factors: [
        'コートサイズが小さい(20×44ft、テニスの約1/4)',
        'アンダーハンドサーブで肩への負担が少ない',
        '軽量パドルとプラスチックボールで衝撃が少ない',
        'ボール速度が遅く反応時間に余裕がある',
    ],
    injury_prevention: [
        '5-10分のウォームアップ(ジョギング、ダイナミックストレッチ)',
        'コート用シューズの着用(横方向のサポートが重要)',
        'グリップサイズの適切なパドル選び(テニスエルボー予防)',
        '保護メガネの着用推奨',
        '段階的にプレイ時間と強度を増やす',
        '適切な水分補給',
        '十分な休息と回復日',
    ],
};
saveJson('supplementary/health_benefits.json', healthBenefits);
console.log('健康効果: 作成完了');

// ============================================
// 3. パドルテクノロジー解説JSON
// ============================================
const paddleTech = [
    {
        id: 'tech_thermoformed', name: 'サーモフォーム', category: '製造技術',
        generation: 'Gen 2', description: '熱と圧力でパドルを一体成型する技術。従来の接着式と比べ、剛性、耐久性、スイートスポットが向上。デラミネーション(層の剥離)リスクを大幅に低減。',
        benefits: ['スイートスポット拡大', '耐久性向上(デラミネーション防止)', '安定した打球感', '一体成型による均一な品質'],
        used_by: ['Selkirk', 'JOOLA', 'CRBN', 'Engage']
    },
    {
        id: 'tech_raw_carbon', name: 'Raw Carbon Fiber (生カーボンファイバー)', category: '面素材',
        description: '未処理のカーボンファイバーをパドル面に使用。自然なザラザラとした質感がボールへのグリップを高め、高いスピン性能を実現。ペリプライプロセスで長持ちするテクスチャー。',
        benefits: ['最大のスピン性能', '予測しやすい打球感', '長持ちするテクスチャー', '軽量で操作性良好'],
        used_by: ['CRBN', 'JOOLA', 'Vatic Pro', 'Selkirk']
    },
    {
        id: 'tech_foam_edge', name: 'フォームエッジウォール', category: 'コア技術',
        generation: 'Gen 3/4', description: 'パドル周辺部にフォームを注入する技術。スイートスポットを拡大し、振動を吸収。エッジヒットの安定性を大幅に改善。',
        benefits: ['スイートスポット拡大', '振動吸収(テニスエルボー予防)', 'エッジヒットの安定性', 'コア構造の長寿命化'],
        used_by: ['JOOLA (Hyperfoam)', 'Selkirk (FLX)', 'Engage']
    },
    {
        id: 'tech_edgeless', name: 'エッジレス設計', category: 'パドル設計',
        description: 'エッジガードを省いた設計。打球面を最大化し、スイートスポットを広げる。空力性能も向上し、振り抜きが良くなる。',
        benefits: ['打球面積最大化', '空力性能向上', 'タッチ感の向上', 'モダンなデザイン'],
        drawbacks: ['落下時の耐久性に注意', 'エッジ直撃時の不安定さ'],
        used_by: ['Gearbox', 'Six Zero']
    },
    {
        id: 'tech_elongated', name: 'エロンゲーテッド(延長型)', category: 'パドル形状',
        description: '標準より長く、やや幅が狭いパドル形状(16.5"+)。リーチとパワーが向上するが、スイートスポットはやや狭め。上級者やテニス経験者に人気。',
        benefits: ['リーチの延長', 'パワーの向上', 'スピン性能の向上', 'テニス経験者に馴染みやすい'],
        drawbacks: ['スイートスポットがやや狭い', '初心者には扱いにくい場合あり'],
        used_by: ['Gearbox', 'CRBN', 'Engage', 'Volair']
    },
    {
        id: 'tech_hybrid_shape', name: 'ハイブリッド形状', category: 'パドル形状',
        description: 'ワイドボディとエロンゲーテッドの中間サイズ(約16"×8")。パワー、コントロール、スピン、許容性のバランスに優れた万能型。中級者に最適。',
        benefits: ['バランスの取れた性能', '広いスイートスポット', 'リーチと許容性の両立', '全プレイスタイルに対応'],
        used_by: ['Selkirk', 'JOOLA', 'Head', 'Diadem']
    },
];
saveJson('supplementary/paddle_technology.json', paddleTech);
console.log('パドルテクノロジー: ' + paddleTech.length + '件作成');

// サマリー
console.log('\n========================================');
console.log('連続深掘り Round 6 完了');
console.log('========================================');
console.log('歴史: ' + history.timeline.length + 'イベント + 成長統計');
console.log('健康効果: カロリー/メリット/怪我予防');
console.log('パドルテクノロジー: ' + paddleTech.length + '技術');
