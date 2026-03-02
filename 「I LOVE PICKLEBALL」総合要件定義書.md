# **「I LOVE PICKLEBALL」総合要件定義書 (PRD) 兼 データベース設計書**

## **1\. プロジェクト概要と市場背景**

### **1.1. プロダクトビジョンと市場インサイト**

本サイトは、日本国内におけるピックルボールの「包括的エコシステム」となる次世代特化型スポーツメディアである。

市場調査（ボルダリングやサーフィン等の先行ニッチスポーツメディア分析、および米『The Dink』等の先行事例）から得られたインサイトに基づき、単なる情報発信ではなく、**競技者、運営施設、用具メーカーをシームレスに結びつけるインフラ**を構築する。

**3つのコアバリュー：**

1. **自己進化するデータベース**: クローラー自動収集とUGC（ユーザー補正）の掛け合わせによる圧倒的な情報鮮度。  
2. **熱狂的なローカルコミュニティ**: サークル機能や施設ごとの待ち合わせ掲示板による、オンラインからオフラインへの送客。  
3. **アワード・権威性の構築**: ユーザー投票に基づく「ベスト・ギア」「ベスト・コート」の表彰企画による、業界内でのブランド確立。

### **1.2. ターゲットユーザーと提供価値（ユーザージャーニー）**

1. **潜在層・初心者 (DUPR 1.0 \- 2.5)**  
   * **ニーズ**: ルールを知りたい、体験会を探したい、安くて可愛い/かっこいいパドルを買いたい、おしゃれなウェアが欲しい。  
   * **提供価値**: 視覚的なルール解説動画、マップからの直感的な体験会検索、アパレル・ECアフィリエイトへのスムーズな導線。  
2. **中級者 (DUPR 3.0 \- 4.0)**  
   * **ニーズ**: 固定の練習仲間が欲しい、レベルアップの壁を越えたい、自分に合うギアに買い替えたい。  
   * **提供価値**: サークル（コミュニティ）参加機能、レベル別のドリル（練習）動画DB、詳細スペックに基づくパドル・シューズ検索。  
3. **上級者・競技者 (DUPR 4.5+)**  
   * **ニーズ**: 公式大会で勝ちたい、プロの戦術やセッティングを知りたい、遠征先の詳細なコート環境を知りたい。  
   * **提供価値**: 世界・国内トッププロ名鑑（使用ギア紐付け）、マニアックなコートスペック（床材、余白）の開示、大会エントリー動線。  
4. **観戦・ファン層（プレー未経験含む）**  
   * **ニーズ**: プロのスーパープレーを見たい、推しの選手を探したい、大会の結果を知りたい。  
   * **提供価値**: プロ選手名鑑、海外リーグ（PPA, MLP）の最新ニュース解説記事、選手へのコメント機能。

## **2\. コア機能とUI/UXアーキテクチャ**

### **2.1. インタラクティブ・マップビュー（視覚的検索）**

* **機能**: Google Maps APIを活用した全体マップ。現在地周辺のプレイスポットやショップを直感的に探せる。  
* **UI表示**:  
  * ピンの色分け：🏓コートのみ（青）、🛍️ショップのみ（オレンジ）、🌟併設施設・プレミアム施設（赤/特別アイコン）  
  * ハーフモーダルUI：ピンタップで画面遷移せず、営業時間や写真、パドルレンタル有無が下部からスライド表示される。

### **2.2. UGCデータクレンジングと「アワード」連動機能**

* **「合ってますか？」システム**: AI/クローラーが集めた施設情報に対し、ユーザーが「合っている」「違います」を投票。エラー報告が多い施設は次回クローラーで優先調査。  
* **年間アワード投票機能（JAPAN PICKLEBALL AWARDS）**: ユーザーのお気に入り登録数、レビューの星の数、および特設ページでの投票システムを連動させ、「今年のベストパドル」「ベストアパレル」「最高環境のコート」を自動集計・発表する。

### **2.3. マネタイズ基盤（アフィリエイト＆送客）**

* ギアDBの全アイテム（パドル、シューズ、ボール、アパレル、バッグ）に、Amazon、楽天、Yahoo\!ショッピングのアフィリエイトリンクを動的に配置。  
* ECサイトや施設と提携した限定クーポンコード（ILOVEPB10等）の配布機能。

## **3\. カテゴリー別コンテンツ仕様**

### **3.1. 施設・コート・ショップ (Where to Play & Buy)**

* **外部連携**: Googleマップ直接遷移、代表写真1枚（出処管理付）、公式YouTubeの埋め込み。  
* **アメニティとスペックの分離設計**:  
  * **「施設」**: カフェ、キッズスペース、シャワー、駐車場など「場所全体」の快適性。  
  * **「コート」**: 屋内/屋外、サーフェス（床材）、ベースラインの余白、ネット種別など「プレー」の質。  
* **コミュニティ連動**: 施設ごとの「いいね数」、ユーザーの「口コミ」、および「施設専用の待ち合わせ掲示板」。

### **3.2. ギア・アイテム・ファッション (Gear & Style)**

* **パドル**: スウィングウェイト等の数値データ ＋ 「対象層」「デザインテイスト」「カラー」による情緒的検索。  
* **シューズ**: サイズ展開、デザインパターン、対応コート。  
* **ボール**: グレード（公式/練習用）、穴の数、色、耐久性。  
* **アパレル＆バッグ**: スコート（プリーツ等）、ユニフォーム、キャップ、大容量バッグなど。ボール収納ポケットの有無やUVカット素材などの機能性もDB化。

### **3.3. プロ選手・トッププレーヤー名鑑 (The Pros)**

* 世界のトッププロ（PPA, MLP）や国内選手のプロフィール、SNSリンク、最新ランキング、戦歴。  
* **使用ギア連携**: パドル、シューズ、契約アパレルブランドを紐付け。

### **3.4. 教材・練習メニュー (Drills)**

* YouTube動画を「初心者/中級者/上級者」および「練習テーマ」でタグ付けし自動推薦。

### **3.5. メディア記事（エディトリアル）コンテンツ戦略と見出し案**

検索流入（SEO）とSNSシェアを最大化するため、ユーザーの課題・関心事に寄り添った網羅的な記事群を展開する。記事は articles テーブルで管理し、各DB（ギア・施設）へ送客する。

#### **① 初心者ガイド・入門編 (Pickleball 101\)**

* 【図解】5分でわかる！ピックルボールのルールとスコアの数え方完全ガイド  
* テニス・卓球・バドミントン経験者別！ピックルボール転向時に活きる技術と捨てるべきクセ  
* 【2026年最新】予算1万円で揃う！初心者に絶対おすすめのスターターパドル5選  
* 服装はどうすればいい？初めてのピックルボールで失敗しないウェア選びとマナー  
* どこでできるの？「オープンプレイ（個人参加）」で知っておきたい暗黙のルールと挨拶  
* ピックルボール用語集（キッチン、ディンク、サードショットドロップって何？）  
* 初心者が絶対にやってはいけない「キッチン（ノンボレーゾーン）」での反則3選  
* ピックルボールは何歳から何歳まで楽しめる？シニア世代の新しい趣味としての魅力

#### **② ギア選び・詳細レビュー・ファッション (Gear & Style)**

* パワフルに打ちたい？それともコントロール？「コア厚（14mm vs 16mm）」の徹底比較  
* 「Raw Carbon Fiber (T700)」って何？最新パドル素材のトレンドと選び方  
* 屋内と屋外でボールは変えるべき？インドア用(26穴)・アウトドア用(40穴)の違いを検証  
* テニスシューズじゃダメ？ピックルボール専用シューズを履くべき3つの理由  
* 【レディース向け】可愛くて動きやすい！最新プリーツスコート（ボールポケット付き）特集  
* 【メンズ向け】汗をかいても快適！プロも愛用する高機能・速乾スポーツウェアブランド5選  
* パドルは何本入る？シューズ収納は？ピックルボール専用「大容量バッグ」おすすめ比較  
* グリップテープの選び方（ドライ vs ウェット）と正しい巻き方講座  
* 目を守るために！インドアでも着用推奨の「スポーツ用アイウェア（保護メガネ）」カタログ

#### **③ 戦術・ドリル・レベルアップ (Strategy & Drills)**

* DUPR 3.5の壁を越える！「サードショット・ドロップ」成功率を劇的に上げる5つのコツ  
* ディンク戦で焦ってミスしてない？忍耐力と配球を鍛える「壁打ち」ドリル集  
* 前衛でのファイヤーファイト（打ち合い）を制す！ブロックボレーの基本姿勢とラケットワーク  
* シングルスとダブルス、戦術はこんなに違う！勝つためのポジショニング  
* 「スタッキング（陣形）」って何？メリットと正しいスコアの数え方を徹底解説  
* 風が強い日の戦い方！アウトドアコートで勝つためのロブとドライブの使い分け  
* 相手のロブが取れない！スマッシュを決めるための正しいフットワークとポジショニング  
* 試合前の効果的なウォームアップと、テニス肘（ピックルボール肘）を防ぐストレッチ

#### **④ コート・コミュニティ・ローカル情報 (Local & Community)**

* 【東京/関東版】仕事帰りに寄れる！ナイター設備・レンタル完備のピックルボールコート10選  
* 雨の日でも安心！冷暖房完備・インドアで快適にプレーできるプレミアム施設特集  
* 仲間探しから大会エントリーまで！I LOVE PICKLEBALL「サークル機能」の活用マニュアル  
* ひとりでも大丈夫！一人参加OKな練習会・体験会の見つけ方  
* 週末はピックルボール合宿へ！リゾート気分で楽しめる宿泊施設併設コート特集  
* 大会に初エントリー！当日の持ち物と、草大会から公式戦までの流れガイド  
* コートの「サーフェス（床材）」でボールの弾みはどう変わる？体育館からデコターフまで徹底解説

#### **⑤ プロ動向・ニュース・観戦ガイド (News & The Fans)**

* 伝説のプレーヤー、ベン・ジョンズの強さの秘密と「最新使用パドル」を徹底解剖！  
* 女王アンナ・リー・ウォーターズ（ALW）の圧倒的な攻撃力と戦術を分析  
* PPAとMLPって何が違うの？世界のピックルボールプロリーグ基礎知識と視聴方法  
* 【JAPAN PICKLEBALL AWARDS】ユーザー投票で決まる！今年の「ベストパドル」と「最高環境のコート」  
* ピックルボールプロの賞金事情と、急成長するスポーツビジネスの裏側  
* 今注目の日本人トッププレーヤー名鑑！国内大会を牽引するスター選手たち  
* 次の流行はこれ！2026年のピックルボールギア「トレンド予測と新テクノロジー」

## **4\. コミュニティ・ユーザー交流機能 (Community & Connect)**

* **マイページ**: お気に入り、プレイログ、DU​​PRスコア管理。  
* **サークル作成**: ユーザー主導の条件付きコミュニティ機能。  
* **目的別掲示板**: パートナー募集、ギア相談、ルールQ\&A。  
* **プレイログ機能**: 練習や試合の記録を写真付きで投稿し、リアクションし合う機能。

## **5\. データベース（DB）スキーマ設計書**

### **💡 データベース上の「場所」の定義（重要）**

データベースの構造を現実世界に合わせてシンプルにするため、以下の3層構造で管理する。

1. **施設 (facilities)**：住所を持つ「建物・敷地」全体。シャワーやカフェ等のアメニティはここに属する。  
2. **コート (facility\_courts)**：施設内にある「プレー環境」。床材や面数はここに属する。  
3. **ショップ (facility\_shops)**：施設内にある「物販エリア」。

※クローラーによる自動収集を前提とし、「情報なし」の場合は NULL を許容する。

### **5.1. 施設・コート・ショップ関連テーブル**

#### **facilities (施設基本情報・アメニティ)**

すべての「場所」のベースとなるテーブル。カフェやキッズスペースなど、施設全体の設備はここで管理する。

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| name | VARCHAR(255) | 施設名（例：〇〇総合公園、〇〇スポーツクラブ、〇〇ピックルボールショップ） |
| type\_flag | TINYINT | 1:コートあり, 2:ショップのみ(コートなし), 3:コート＆ショップ併設 |
| operator\_type | VARCHAR(50) | 【選択肢】民間, 自治体(公営), 専門店 等 |
| is\_premium | BOOLEAN | アワード受賞などの優良施設フラグ |
| address | VARCHAR(255) |  |
| latitude / longitude | DECIMAL | マップピン用 |
| main\_photo\_url | TEXT |  |
| youtube\_url | TEXT |  |
| hosts\_tournaments | BOOLEAN | 大会主催の有無 |
| tournament\_types | VARCHAR(100) | 【選択肢】JPA公式大会, 草大会 等 |
| has\_shower | TINYINT | シャワールームの有無(1:あり) |
| has\_locker\_room | TINYINT | 更衣室の有無(1:あり) |
| has\_cafe | TINYINT | カフェ・飲食スペースの有無(1:あり) |
| has\_kids\_space | TINYINT | キッズスペース・待機・託児所の有無(1:あり) |
| has\_parking | TINYINT | 駐車場の有無(1:あり) |
| has\_wifi | TINYINT | Wi-Fi環境の有無(1:あり) |
| hours\_mon 〜 hours\_sun | VARCHAR(50) | 曜日ごとの営業時間 |
| reservation\_method | VARCHAR(50) | 【選択肢】Web予約, 電話のみ, 予約不要 |
| like\_count | INT | お気に入り総数 |
| error\_report\_count | INT | 「違います」ボタン押下回数 |
| last\_crawled\_at | TIMESTAMP | クローラーの更新管理用 |

#### **facility\_courts (コート設備詳細)**

施設の中にある「プレーする場所」の詳細データ。※ショップのみの施設はデータを持たない。

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK, AutoInc |
| facility\_id | BIGINT | FK (facilities.id に紐付け) |
| court\_type | VARCHAR(50) | 【選択肢】インドア, アウトドア |
| number\_of\_courts | INT | そのタイプのコート面数 |
| surface\_type | VARCHAR(50) | 【選択肢】木製(体育館), デコターフ(ハード), 人工芝, アスファルト 等 |
| line\_visibility | VARCHAR(50) | 【選択肢】専用ラインのみ(見やすい), 他競技混在(見にくい), テープ貼り |
| net\_type | VARCHAR(50) | 【選択肢】常設(埋め込み), ポータブル(キャスター付), ポータブル(キャスター無) |
| has\_ac | TINYINT | 空調・エアコンの有無(インドアの場合) |
| baseline\_margin | VARCHAR(50) | ベースライン後方の余白(ロブが追いやすいか) |
| lighting\_type | VARCHAR(50) | ナイター照明の有無・種類(LED等) |

#### **facility\_shops (物販・レンタル設備詳細)**

施設の中にある「買う場所・借りる場所」の詳細データ。

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK, AutoInc |
| facility\_id | BIGINT | FK (facilities.id に紐付け) |
| has\_paddle\_sales | TINYINT | パドルなどギアの販売スペース有無(1:あり) |
| has\_apparel\_sales | TINYINT | ウェアなどアパレルの販売スペース有無(1:あり) |
| has\_paddle\_rental | TINYINT | パドルレンタルの有無(1:あり) |
| paddle\_rental\_fee | INT | パドルレンタル料(円) |
| handled\_brands | VARCHAR(255) | 取扱いメーカー(例: "JOOLA, Franklin") |

#### **facility\_comments (施設ごとの口コミ)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| facility\_id | BIGINT | FK |
| user\_id | BIGINT | FK |
| content | TEXT | 口コミ本文 |
| created\_at | TIMESTAMP |  |

### **5.2. ギア・アイテム・ファッション関連テーブル**

#### **gears\_paddles (パドルマスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) | 【選択肢】JOOLA, Franklin, Selkirk, CRBN, Six Zero, Vatic Pro 等 |
| product\_name | VARCHAR(255) |  |
| price | INT | 参考価格 |
| paddle\_shape | VARCHAR(50) | 【選択肢】Elongated(長方形), Standard(標準), Wide Body(幅広), Hybrid |
| face\_material | VARCHAR(100) | 【選択肢】Raw Carbon Fiber, Fiberglass, Kevlar, Graphite |
| core\_material | VARCHAR(100) | 【選択肢】Polymer Honeycomb, Nomex |
| core\_thickness | DECIMAL(4,1) | 【選択肢】10mm, 12mm, 14mm, 16mm, 20mm |
| target\_demographic | VARCHAR(100) | 【選択肢】上級者, 中級者, 初心者, ジュニア, 女性向け |
| design\_taste | VARCHAR(100) | 【選択肢】シンプル, ポップ, スポーティー, ラグジュアリー |
| color\_variations | TEXT | 例: "ブラック, ネオンピンク" |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT | アフィリエイトURL |

#### **gears\_shoes (シューズマスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) | 【選択肢】K-Swiss, FILA, Skechers, Babolat, Asics 等 |
| product\_name | VARCHAR(255) |  |
| size\_range | VARCHAR(100) | 例: "22.5cm \- 29.0cm" |
| color\_variations | TEXT |  |
| court\_type | VARCHAR(50) | 【選択肢】インドア専用(ガムソール), アウトドア専用, オールコート |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT |  |

#### **gears\_balls (ボールマスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) | 【選択肢】Franklin, Dura, Vulcan, CORE, Onix 等 |
| product\_name | VARCHAR(255) |  |
| grade | VARCHAR(50) | 【選択肢】公式大会使用球(USAP承認), 準公式球, 練習用 |
| ball\_type | VARCHAR(50) | 【選択肢】インドア用(26穴), アウトドア用(40穴) |
| color\_variations | TEXT | 【選択肢】ネオンイエロー, オレンジ, ピンク |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT |  |

#### **gears\_apparel (アパレル・ウェアマスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) | 【選択肢】Lululemon, FILA, Nike, Adidas, 各種PBブランド 等 |
| product\_name | VARCHAR(255) |  |
| price | INT | 参考価格 |
| category | VARCHAR(50) | 【選択肢】トップス(Tシャツ/ポロ), ボトムス(ショーツ), スコート/スカート, ワンピース, アウター |
| target\_gender | VARCHAR(20) | 【選択肢】Womens(女性用), Mens(男性用), Unisex(男女兼用), Kids |
| material\_features | VARCHAR(255) | 【選択肢】吸汗速乾, 接触冷感, UVカット, ストレッチ, 軽量 |
| has\_ball\_pocket | BOOLEAN | ボールを収納できるアンダーパンツやポケットの有無(1:あり) |
| design\_taste | VARCHAR(100) | 【選択肢】プリーツ, フリル, スポーティー, クラシック, パステルカラー |
| size\_range | VARCHAR(100) | 【選択肢】XS, S, M, L, XL |
| color\_variations | TEXT | 例: "ホワイト, ネイビー, ペールピンク" |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT |  |

#### **gears\_bags (バッグ・鞄マスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) |  |
| product\_name | VARCHAR(255) |  |
| price | INT | 参考価格 |
| bag\_type | VARCHAR(50) | 【選択肢】バックパック, トートバッグ, ダッフルバッグ, スリングバッグ |
| paddle\_capacity | INT | 収納可能パドル本数 (例: 2\) |
| has\_shoe\_pocket | BOOLEAN | シューズ専用収納コンパートメントの有無(1:あり) |
| has\_fence\_hook | BOOLEAN | コートのフェンスに引っ掛けるフックの有無(1:あり) |
| has\_thermal\_pocket | BOOLEAN | 飲み物や軽食を入れる保冷ポケットの有無(1:あり) |
| color\_variations | TEXT |  |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT |  |

#### **gears\_accessories (小物・アクセサリーマスタ)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| brand\_name | VARCHAR(100) |  |
| product\_name | VARCHAR(255) |  |
| price | INT | 参考価格 |
| category | VARCHAR(50) | 【選択肢】グリップテープ, アイウェア(保護メガネ), サンバイザー/キャップ, リストバンド, タオル, ソックス |
| specific\_features | VARCHAR(255) | 例(グリップ): "ドライ/ウェット", 例(アイウェア): "曇り止め/調光レンズ" |
| color\_variations | TEXT |  |
| amazon\_url / rakuten\_url / yahoo\_url | TEXT |  |

### **5.3. プロ選手・専門家関連テーブル**

#### **pro\_players (プロ・トッププレーヤー名鑑)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| name\_ja / name\_en | VARCHAR(100) |  |
| nationality | VARCHAR(50) |  |
| birth\_date | DATE |  |
| play\_style | VARCHAR(100) |  |
| league\_affiliation | VARCHAR(50) | 【選択肢】PPA Tour, MLP, APP, JPA |
| ranking\_singles / ranking\_doubles | INT |  |
| participating\_tournaments | TEXT | 主な出場大会・戦績 |
| paddle\_ids / shoe\_ids | VARCHAR(255) | 複数IDをカンマ区切り |
| apparel\_brand\_sponsor | VARCHAR(100) | 契約アパレルブランド |
| instagram\_url / facebook\_url / x\_url | TEXT |  |
| photo\_url | TEXT |  |

#### **expert\_reviews (専門家・プロ評価)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| item\_type | VARCHAR(20) | 【選択肢】paddle, shoe, ball, apparel |
| item\_id | BIGINT | 対象ギアのID |
| player\_id | BIGINT | FK (プロ選手の場合) |
| expert\_name | VARCHAR(100) | (プロDBにない専門家や公認コーチの場合) |
| score | DECIMAL(3,1) | 1-10段階評価 |
| comment | TEXT |  |

### **5.4. メディア記事（エディトリアル）関連テーブル**

#### **articles (メディア記事テーブル)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| title | VARCHAR(255) | 記事のタイトル |
| content | TEXT | 記事本文（リッチテキスト） |
| category | VARCHAR(50) | 【選択肢】初心者ガイド, ギアレビュー, 戦術・ドリル, ローカル情報, ニュース・プロ動向 |
| target\_audience | VARCHAR(50) | 【選択肢】初心者, 中級者, 上級者, 観戦・ファン, 全員 |
| thumbnail\_url | TEXT | 記事のサムネイル画像URL |
| author\_id | BIGINT | 執筆者ユーザーID |
| related\_gear\_ids | VARCHAR(255) | 記事内で紹介しているパドル、アパレル等のID群 |
| related\_facility\_ids | VARCHAR(255) | 記事内で紹介している施設ID群 |
| related\_player\_ids | VARCHAR(255) | 記事内で取り上げているプロ選手ID群 |
| status | VARCHAR(20) | 【選択肢】draft(下書き), published(公開済), archived(アーカイブ) |
| published\_at | TIMESTAMP | 公開日時 |

### **5.5. ユーザー・コミュニティ・学習関連テーブル**

#### **users (ユーザー情報)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| nickname | VARCHAR(100) |  |
| is\_profile\_public | BOOLEAN | 1: 公開, 0: 非公開 |
| is\_ambassador | BOOLEAN | ローカルガイド/アンバサダー権限 |
| generation | VARCHAR(20) | 【選択肢】10代以下, 20代, 30代, 40代, 50代, 60代以上 |
| gender | VARCHAR(20) | 【選択肢】男性, 女性, その他, 未回答 |
| avatar\_url | TEXT |  |
| dupr\_score | DECIMAL(3,2) | 例: 3.50 |
| estimated\_level | VARCHAR(20) | 【選択肢】未経験, 初心者, 中級者, 上級者, 観戦・ファン |
| play\_style | VARCHAR(50) | 【選択肢】ダブルス中心, シングルス中心, 両方 |
| my\_paddle\_id | BIGINT | FK |
| created\_at | TIMESTAMP |  |

#### **announcements (運営からのお知らせ)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| title | VARCHAR(255) |  |
| content | TEXT |  |
| is\_important | BOOLEAN | 1: 強調表示 |
| published\_at | TIMESTAMP |  |

#### **communities (コミュニティ本体テーブル)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| name | VARCHAR(255) |  |
| description | TEXT |  |
| target\_area | VARCHAR(100) | 例: "東京都" |
| age\_limit\_min / age\_limit\_max | INT | 年齢制限 |
| target\_level | VARCHAR(100) |  |
| owner\_user\_id | BIGINT | FK |
| created\_at | TIMESTAMP |  |

#### **community\_members (コミュニティ所属メンバー中間テーブル)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| community\_id | BIGINT | PK, FK |
| user\_id | BIGINT | PK, FK |
| role | VARCHAR(20) | 'owner'(管理者), 'member'(一般) |
| joined\_at | TIMESTAMP |  |

#### **community\_threads (コミュニティ内クローズド掲示板)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| community\_id | BIGINT | FK |
| author\_id | BIGINT | FK |
| title | VARCHAR(255) |  |
| content | TEXT |  |
| created\_at | TIMESTAMP |  |

#### **threads (オープン掲示板・施設別掲示板)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| category | VARCHAR(50) | 【選択肢】facility\_match(施設待ち合わせ), gear\_qa(ギア相談), rule\_qa(ルール質問), partner\_search(相方募集) |
| facility\_id | BIGINT | 施設専用スレッドの場合 |
| author\_id | BIGINT | FK |
| title / content | TEXT |  |
| status | VARCHAR(20) | 【選択肢】open(募集中/受付中), closed(解決済/締切) |

#### **activity\_logs (プレイログ)**

| カラム名 | データ型 | 備考 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| user\_id | BIGINT | FK |
| facility\_id | BIGINT | FK |
| content | TEXT |  |
| image\_url | TEXT |  |
| like\_count | INT |  |
| created\_at | TIMESTAMP |  |

#### **drills (教材・練習メニューDB)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| title | VARCHAR(255) |  |
| target\_level | VARCHAR(50) | 【選択肢】初心者向け, 中級者向け, 上級者向け |
| skill\_focus | VARCHAR(100) | 【選択肢】サードショットドロップ, ディンク, トランジション, サーブ＆リターン, ボレー戦, スタッキング |
| youtube\_url | TEXT |  |
| description | TEXT | 日本語解説 |

#### **events (大会・イベント情報)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| facility\_id | BIGINT | FK |
| title | VARCHAR(255) |  |
| event\_type | VARCHAR(50) | 【選択肢】公式大会(JPA等), 草大会, 体験会, オープンプレイ, 練習会, レッスン |
| start\_datetime / end\_datetime | DATETIME |  |
| target\_level\_min / target\_level\_max | DECIMAL(3,2) | DUPR基準 |
| entry\_fee | INT |  |
| entry\_url | TEXT |  |

#### **user\_bookmarks (お気に入り/ウィッシュリスト)**

| カラム名 | データ型 | 備考・選択肢例 |
| :---- | :---- | :---- |
| id | BIGINT | PK |
| user\_id | BIGINT | FK |
| item\_type | VARCHAR(50) | 【選択肢】facility, paddle, shoe, ball, apparel, bag, accessory, pro\_player, drill, article |
| item\_id | BIGINT | 各テーブルのID |

## **6\. サイト運営・成長サイクル (Flywheel Effect)**

本プラットフォームは、以下のサイクルを回すことで持続的な成長と収益化を実現する。

1. **データ収集 (Automate)**: クローラーが国内外の施設・ギア情報を自動で拾い上げる。  
2. **集客と提供 (Attract)**: SEO（網羅的な記事群やマニアックなDB）とマップ検索機能でユーザーを獲得し、アフィリエイトで収益化。  
3. **交流と定着 (Engage)**: ユーザーがサークルを作り、プレイログや待ち合わせ掲示板を利用することで、「毎日開くアプリ（サイト）」となる。  
4. **自己浄化と権威化 (Evolve)**: ユーザーからのエラー報告でデータが正確になり、年末の「アワード投票」によってメディア自体が業界の権威となる。