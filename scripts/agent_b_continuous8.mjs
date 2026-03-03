/**
 * 連続深掘り Round 8:
 * - エチケット/マナーガイドJSON
 * - パドルメンテナンスガイドJSON
 * - ウォームアップ/クールダウンガイドJSON
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = join(__dirname, '..', 'production_data');
function saveJson(r, d) { writeFileSync(join(BASE, r), JSON.stringify(d, null, 2) + '\n', 'utf-8'); }

// ============================================
// 1. エチケット/マナーガイド
// ============================================
const etiquette = {
    before_game: [
        { rule: '挨拶とパドルタップ', description: '試合前に必ず挨拶。知らない相手にも自己紹介とパドルタップ(パドル同士を軽くタッチ)。' },
        { rule: 'パドルスタッキング', description: '地元のルールに従い、パドルを順番に並べてコートへのアクセスを公平に管理する。' },
        { rule: 'プレイ中のコートへ入らない', description: '進行中のゲームには割り込まない。自然なブレイクを待ってからコートに入る。' },
        { rule: '準備の確認', description: '自分の出番が来たらすぐにプレイできるように準備しておく。' },
        { rule: '基本ルールの理解', description: '最低限の基本ルールを理解してからプレイに参加する。' },
    ],
    during_game: [
        { rule: 'スコアの明確な宣言', description: '毎サーブ前に大きくはっきりスコアを宣言。混乱を防ぐ。' },
        { rule: '全員の準備を待つ', description: 'サーブ前に全プレイヤー(味方も相手も)がポジションに着いていることを確認。' },
        { rule: '正直なラインコール', description: 'イン/アウトは正直にコール。迷った場合は相手に有利な判定を。' },
        { rule: '自分のフォルトは自己申告', description: 'フットフォルトやネットタッチなど、自分のフォルトは自分で申告する。' },
        { rule: 'パートナーとのコミュニケーション', description: '「マイン」「ユアーズ」で明確にコール。衝突や混乱を防ぐ。' },
        { rule: '冷静さを保つ', description: 'フラストレーションを表に出さない。暴言や攻撃的なジェスチャー禁止。' },
        { rule: '騒音への配慮', description: '隣接コートのプレイの邪魔にならないよう、適度なボリュームで。' },
        { rule: '弱い相手を狙い続けない', description: 'オープンプレイでは弱い相手ばかり狙わず満遍なく打つ。' },
        { rule: '頼まれていないアドバイスはしない', description: 'コーチングは求められない限り控える。' },
        { rule: '「ボールオン！」', description: '迷いボールがコートに入ったら即座に「ボールオン！」とコールしプレイを停止。' },
        { rule: 'コート横断のマナー', description: '他のコートの裏を通る時はポイント終了を待ち、素早く静かに横断。' },
    ],
    after_game: [
        { rule: 'ネットでのパドルタップ', description: '試合終了後、全員とネットでパドルタップ。勝敗に関わらずポジティブなコメントを。' },
        { rule: '相手を称える', description: '相手の好プレイを称え、勝っても謙虚に、負けても潔く。' },
        { rule: 'コートを速やかに空ける', description: '荷物をまとめてすぐ退出。待っている人がプレイできるように。' },
    ],
};
saveJson('supplementary/etiquette.json', etiquette);
console.log('エチケット/マナー: 作成完了 (試合前' + etiquette.before_game.length + '/中' + etiquette.during_game.length + '/後' + etiquette.after_game.length + '件)');

// ============================================
// 2. パドルメンテナンスガイド
// ============================================
const maintenance = {
    cleaning: {
        routine: { frequency: '毎プレイ後', method: 'マイクロファイバークロスでパドル面、エッジ、ハンドルの表面のホコリ・汗を拭き取る。' },
        deep_clean: { frequency: '週1回/月1回', method: '柔らかい布に少量のマイルドソープ(食器用洗剤)を含ませ、パドル面を軽く拭く。カーボンファイバーパドルはクリーニングブロックも有効。洗浄後は完全に乾かす。', caution: '強い化学薬品、研磨剤、ベタつく残留物のあるクリーナーは使用禁止。' },
        grip: { method: '湿らせた布とマイルドソープでグリップを拭く。滑りやすくなったらオーバーグリップを巻くか交換。' },
    },
    edge_protection: {
        edge_tape: '市販のエッジガードテープを貼り付ける。コートとの接触によるキズ・チップ・凹みを防ぐ。摩耗したら交換。各種幅が入手可能。',
        inspection: '定期的にエッジガードのひび割れ、チップ、接着力低下をチェック。発見次第交換。',
    },
    storage: {
        temperature: '涼しく乾燥した場所に保管。直射日光、高温(車内放置禁止)、降温環境を避ける。',
        protection: 'パッド入りカバーやバッグで保管し、輸送時のキズや凹みを防ぐ。',
        moisture: '保管前に完全に乾かす。バッグにシリカゲルパケットを入れると湿気対策に有効。',
    },
    longevity_tips: [
        'パドルを硬い面(地面やフェンス)に叩きつけない',
        '祝賀時の「パドルクラップ」はやめ、フィストバンプに',
        '複数パドルをローテーション使用',
        '定期的にひび割れ、バブル、ソフトスポットを点検',
        '汚れたボールもクリーニングする(パドルに汚れが移るのを防止)',
        '小さなダメージは早めに対処し悪化を防ぐ',
    ],
    lifespan: 'パドルの平均寿命は6カ月〜3年。使用頻度、プレイ強度、品質、メンテナンス状況による。競技プレイヤーはカジュアルプレイヤーより頻繁に交換が必要。',
};
saveJson('supplementary/maintenance_guide.json', maintenance);
console.log('パドルメンテナンス: 作成完了');

// ============================================
// 3. ウォームアップ/クールダウンガイド
// ============================================
const warmupGuide = {
    warmup: {
        duration: '5-15分',
        light_cardio: { duration: '2-3分', exercises: ['軽いジョギング(コート周回)', 'ジャンピングジャック', 'サイドシャッフル', '早歩き'] },
        dynamic_stretches: [
            { name: 'アームサークル/スイング', target: '肩・上背部', description: '前後・左右・円を描くように腕を振る' },
            { name: 'トランクローテーション', target: '体幹・脊椎', description: '体を左右に優しくひねる' },
            { name: 'レッグスイング', target: '股関節・ハムストリング', description: '前後・左右に足を振る' },
            { name: 'フォワードランジ+ツイスト', target: '脚・体幹', description: '大きく踏み出し上体をひねる' },
            { name: 'ラテラルランジ', target: '内転筋・外転筋', description: '横方向に大きく踏み出す' },
            { name: 'スクワット', target: '臀筋・大腿四頭筋', description: '自重スクワットで下半身を活性化' },
            { name: 'ハイニー&バットキッカー', target: '股関節屈筋・大腿部', description: '膝を高く上げる/かかとをお尻に引きつける' },
            { name: 'インチワーム', target: '全身', description: '手を地面について前に歩き、プランクを経て立ち上がる' },
            { name: 'カーフレイズ', target: 'ふくらはぎ・アキレス腱', description: 'つま先立ちを繰り返す' },
            { name: '手首回し&パドルスイング', target: '手首・前腕・肩', description: '手首を回し、素振りで準備' },
        ],
    },
    cooldown: {
        duration: '10-20分',
        light_aerobic: { duration: '5-10分', description: 'ゆっくり歩く、軽いディンクドリルで心拍数を徐々に下げる' },
        static_stretches: [
            { name: 'カーフストレッチ', target: 'ふくらはぎ', hold: '30-60秒', description: '壁に手をつき片足を後ろに引いて伸ばす' },
            { name: '大腿四頭筋ストレッチ', target: '前もも', hold: '30-60秒', description: '片足を持ち、かかとをお尻に引きつける' },
            { name: 'ハムストリングストレッチ', target: 'もも裏', hold: '30-60秒', description: 'つま先に手を伸ばすか、仰向けでストラップ使用' },
            { name: 'ランナーズランジ', target: '股関節屈筋', hold: '30-60秒', description: '大きく踏み出し、腰を前に押し出す' },
            { name: 'チェストオープナー', target: '胸部', hold: '30-60秒', description: '手を背中の後ろで組んで前傾' },
            { name: 'フィギュアフォーストレッチ', target: '臀筋・股関節', hold: '30-60秒', description: '座って足首を反対の膝に乗せ前傾' },
            { name: '手首・前腕ストレッチ', target: '手首・前腕', hold: '30-60秒', description: '腕を前に伸ばし指を上下に引く' },
        ],
        hydration: 'プレイ後60分以内に水分と栄養を補給',
    },
};
saveJson('supplementary/warmup_cooldown.json', warmupGuide);
console.log('ウォームアップ/クールダウン: 作成完了');

console.log('\n========================================');
console.log('連続深掘り Round 8 完了');
console.log('========================================');
