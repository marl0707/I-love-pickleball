-- I LOVE PICKLEBALL Database Initialization Script (PostgreSQL / MySQL compatible)
-- 主キー（PK）はすべて VARCHAR(255) で統一（サルベージされたシードJSONのデータ型に合わせるため）

-- ==========================================
-- 1. 施設・コート関連テーブル
-- ==========================================
CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_flag INT,
    operator_type VARCHAR(50),
    is_premium BOOLEAN,
    directions_url TEXT,
    access_guide TEXT,
    visitor_welcome BOOLEAN,
    has_school BOOLEAN,
    address VARCHAR(255),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    main_photo_url TEXT,
    youtube_url TEXT,
    hosts_tournaments BOOLEAN,
    tournament_types VARCHAR(100),
    has_shower INT,
    has_locker_room INT,
    has_cafe INT,
    has_kids_space INT,
    has_parking INT,
    has_wifi INT,
    hours_mon VARCHAR(50),
    hours_tue VARCHAR(50),
    hours_wed VARCHAR(50),
    hours_thu VARCHAR(50),
    hours_fri VARCHAR(50),
    hours_sat VARCHAR(50),
    hours_sun VARCHAR(50),
    reservation_method VARCHAR(50),
    like_count INT DEFAULT 0,
    error_report_count INT DEFAULT 0,
    last_crawled_at TIMESTAMP
);

CREATE TABLE facility_courts (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255),
    court_type VARCHAR(50),
    number_of_courts INT,
    surface_type VARCHAR(50),
    line_visibility VARCHAR(50),
    net_type VARCHAR(50),
    has_ac INT,
    baseline_margin VARCHAR(50),
    lighting_type VARCHAR(50)
);

CREATE TABLE facility_shops (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255),
    has_paddle_sales INT,
    has_apparel_sales INT,
    has_paddle_rental INT,
    paddle_rental_fee INT,
    handled_brands VARCHAR(255)
);

CREATE TABLE facility_media (
    id VARCHAR(255) PRIMARY KEY,
    target_type VARCHAR(20),
    target_id VARCHAR(255),
    media_type VARCHAR(20),
    url TEXT,
    description TEXT
);

-- ==========================================
-- 2. ギア・アイテムマスタ関連
-- ==========================================
CREATE TABLE master_brands (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(100),
    description TEXT,
    website_url TEXT
);

CREATE TABLE gears_paddles (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    price INT,
    paddle_shape VARCHAR(50),
    face_material VARCHAR(100),
    core_material VARCHAR(100),
    core_thickness DECIMAL(4,1),
    target_demographic VARCHAR(100),
    design_taste VARCHAR(100),
    color_variations TEXT,
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

CREATE TABLE gears_shoes (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    size_range VARCHAR(100),
    color_variations TEXT,
    court_type VARCHAR(50),
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

CREATE TABLE gears_balls (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    grade VARCHAR(50),
    ball_type VARCHAR(50),
    color_variations TEXT,
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

CREATE TABLE gears_apparel (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    price INT,
    category VARCHAR(50),
    target_gender VARCHAR(20),
    material_features VARCHAR(255),
    has_ball_pocket BOOLEAN,
    design_taste VARCHAR(100),
    size_range VARCHAR(100),
    color_variations TEXT,
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

CREATE TABLE gears_bags (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    price INT,
    bag_type VARCHAR(50),
    paddle_capacity INT,
    has_shoe_pocket BOOLEAN,
    has_fence_hook BOOLEAN,
    has_thermal_pocket BOOLEAN,
    color_variations TEXT,
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

CREATE TABLE gears_accessories (
    id VARCHAR(255) PRIMARY KEY,
    brand_name VARCHAR(100),
    product_name VARCHAR(255),
    price INT,
    category VARCHAR(50),
    specific_features VARCHAR(255),
    color_variations TEXT,
    amazon_url TEXT,
    rakuten_url TEXT,
    yahoo_url TEXT
);

-- ==========================================
-- 3. ユーザー・コミュニティ関連
-- ==========================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    nickname VARCHAR(100),
    is_profile_public BOOLEAN,
    is_ambassador BOOLEAN,
    generation VARCHAR(20),
    gender VARCHAR(20),
    avatar_url TEXT,
    dupr_score DECIMAL(4,2),
    estimated_level VARCHAR(20),
    play_style VARCHAR(50),
    my_paddle_id VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE communities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    target_area VARCHAR(100),
    location_text VARCHAR(255),
    age_limit_min INT,
    age_limit_max INT,
    target_level VARCHAR(100),
    beginner_friendly BOOLEAN,
    play_style VARCHAR(50),
    activity_frequency VARCHAR(50),
    schedule_text VARCHAR(255),
    external_url TEXT,
    owner_user_id VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE community_members (
    community_id VARCHAR(255),
    user_id VARCHAR(255),
    role VARCHAR(20),
    joined_at TIMESTAMP,
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE community_media (
    id VARCHAR(255) PRIMARY KEY,
    target_type VARCHAR(20),
    target_id VARCHAR(255),
    media_type VARCHAR(20),
    url TEXT,
    description TEXT
);

CREATE TABLE community_threads (
    id VARCHAR(255) PRIMARY KEY,
    community_id VARCHAR(255),
    author_id VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP
);

CREATE TABLE facility_comments (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255),
    user_id VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP
);

-- ==========================================
-- 4. メディア・学習・イベント関連
-- ==========================================
CREATE TABLE master_associations (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    acronym VARCHAR(50),
    country VARCHAR(100),
    description TEXT,
    website_url TEXT,
    is_hq_facility_id VARCHAR(255)
);

CREATE TABLE master_tags (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(50),
    color_code VARCHAR(20)
);

CREATE TABLE pro_players (
    id VARCHAR(255) PRIMARY KEY,
    name_ja VARCHAR(100),
    name_en VARCHAR(100),
    nationality VARCHAR(50),
    birth_date DATE,
    play_style VARCHAR(100),
    league_affiliation VARCHAR(50),
    ranking_singles INT,
    ranking_doubles INT,
    participating_tournaments TEXT,
    paddle_ids VARCHAR(255),
    shoe_ids VARCHAR(255),
    apparel_brand_sponsor VARCHAR(100),
    instagram_url TEXT,
    facebook_url TEXT,
    x_url TEXT,
    photo_url TEXT
);

CREATE TABLE expert_reviews (
    id VARCHAR(255) PRIMARY KEY,
    item_type VARCHAR(20),
    item_id VARCHAR(255),
    player_id VARCHAR(255),
    expert_name VARCHAR(100),
    score DECIMAL(3,1),
    comment TEXT
);

CREATE TABLE articles (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(50),
    target_audience VARCHAR(50),
    thumbnail_url TEXT,
    author_id VARCHAR(255),
    related_gear_ids VARCHAR(255),
    related_facility_ids VARCHAR(255),
    related_player_ids VARCHAR(255),
    status VARCHAR(20),
    published_at TIMESTAMP
);

CREATE TABLE drills (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    target_level VARCHAR(50),
    skill_focus VARCHAR(100),
    youtube_url TEXT,
    description TEXT
);

CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255),
    title VARCHAR(255),
    event_type VARCHAR(50),
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    target_level_min DECIMAL(3,2),
    target_level_max DECIMAL(3,2),
    entry_fee INT,
    entry_url TEXT
);

CREATE TABLE announcements (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    is_important BOOLEAN,
    published_at TIMESTAMP
);

-- ==========================================
-- 5. ユーザー行動（ログ・UGC）関連
-- ==========================================
CREATE TABLE threads (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(50),
    facility_id VARCHAR(255),
    author_id VARCHAR(255),
    title TEXT,
    content TEXT,
    status VARCHAR(20)
);

CREATE TABLE activity_logs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    facility_id VARCHAR(255),
    content TEXT,
    image_url TEXT,
    like_count INT,
    created_at TIMESTAMP
);

CREATE TABLE user_bookmarks (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    item_type VARCHAR(50),
    item_id VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE check_ins (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    facility_id VARCHAR(255),
    checkin_time TIMESTAMP,
    status VARCHAR(50),
    memo TEXT
);

CREATE TABLE error_reports (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255),
    user_id VARCHAR(255),
    report_type VARCHAR(50),
    comment TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE award_votes (
    id VARCHAR(255) PRIMARY KEY,
    award_id VARCHAR(255),
    user_id VARCHAR(255),
    voted_item_id VARCHAR(255),
    reason TEXT,
    created_at TIMESTAMP
);

-- ==========================================
-- 6. コーチ・戦術・ケア関連（サルベージ特別枠）
-- ==========================================
CREATE TABLE coaches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    specialty TEXT,
    achievements TEXT,
    teaching_style TEXT,
    target_level VARCHAR(100),
    media_url TEXT
);

CREATE TABLE coach_certifications (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    issuing_body VARCHAR(255),
    description TEXT,
    target_audience VARCHAR(255),
    website_url TEXT
);

CREATE TABLE mlp_teams (
    id VARCHAR(255) PRIMARY KEY,
    team_name VARCHAR(100),
    league VARCHAR(100),
    level VARCHAR(50),
    notable_owners TEXT,
    description TEXT
);

CREATE TABLE injury_preventions (
    target_condition VARCHAR(255) PRIMARY KEY,
    cause TEXT,
    prevention_gears TEXT,
    stretches TEXT
);

CREATE TABLE advanced_shots (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100),
    difficulty VARCHAR(50),
    description TEXT,
    when_to_use TEXT,
    how_to_execute TEXT,
    drills TEXT,
    risk TEXT,
    youtube_tutorial_url TEXT
);

-- End of File
