-- ============================================================
-- Mie Gacoan Database — PostgreSQL / Supabase Edition
-- Generated: 2026-06-30
-- Login Admin:  admin@miegacoan.com  /  nabilar123
-- ============================================================

-- ============================================================
-- 0. CLEANUP (jalankan jika ingin reset database)
-- ============================================================
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "Gallery" CASCADE;
DROP TABLE IF EXISTS "Outlet" CASCADE;
DROP TABLE IF EXISTS "Package" CASCADE;
DROP TABLE IF EXISTS "Menu" CASCADE;
DROP TABLE IF EXISTS "SocialMedia" CASCADE;
DROP TABLE IF EXISTS "HeroSlide" CASCADE;
DROP TABLE IF EXISTS "SiteContent" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TYPE IF EXISTS "MenuCategory";

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================
CREATE TYPE "MenuCategory" AS ENUM ('mie', 'dimsum', 'minuman');

-- ============================================================
-- 2. TABLES
-- ============================================================

CREATE TABLE "Admin" (
  "id"        SERIAL PRIMARY KEY,
  "name"      VARCHAR(100) NOT NULL,
  "email"     VARCHAR(150) NOT NULL UNIQUE,
  "password"  VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "SiteContent" (
  "id"        SERIAL PRIMARY KEY,
  "key"       VARCHAR(100) NOT NULL UNIQUE,
  "value"     TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "HeroSlide" (
  "id"        SERIAL PRIMARY KEY,
  "image"     VARCHAR(255) NOT NULL,
  "order"     INTEGER DEFAULT 0,
  "isActive"  BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "SocialMedia" (
  "id"        SERIAL PRIMARY KEY,
  "name"      VARCHAR(100) NOT NULL,
  "icon"      VARCHAR(50) NOT NULL,
  "url"       VARCHAR(500) NOT NULL,
  "isActive"  BOOLEAN DEFAULT TRUE,
  "order"     INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Menu" (
  "id"          SERIAL PRIMARY KEY,
  "name"        VARCHAR(150) NOT NULL,
  "slug"        VARCHAR(150) NOT NULL UNIQUE,
  "category"    "MenuCategory" NOT NULL,
  "description" TEXT,
  "price"       INTEGER NOT NULL,
  "spicyLevel"  INTEGER DEFAULT 0,
  "image"       VARCHAR(255),
  "isActive"    BOOLEAN DEFAULT TRUE,
  "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Package" (
  "id"          SERIAL PRIMARY KEY,
  "name"        VARCHAR(150) NOT NULL,
  "description" TEXT,
  "price"       INTEGER NOT NULL,
  "badge"       VARCHAR(50),
  "image"       VARCHAR(255),
  "isActive"    BOOLEAN DEFAULT TRUE,
  "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Outlet" (
  "id"        SERIAL PRIMARY KEY,
  "name"      VARCHAR(150) NOT NULL,
  "city"      VARCHAR(100) NOT NULL,
  "address"   TEXT NOT NULL,
  "openTime"  VARCHAR(20),
  "mapsUrl"   VARCHAR(500),
  "isOpen"    BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Gallery" (
  "id"        SERIAL PRIMARY KEY,
  "image"     VARCHAR(255) NOT NULL,
  "caption"   VARCHAR(255),
  "category"  VARCHAR(100) DEFAULT 'Umum',
  "order"     INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Testimonial" (
  "id"        SERIAL PRIMARY KEY,
  "name"      VARCHAR(100),
  "rating"    INTEGER NOT NULL,
  "content"   TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. SEED DATA
-- ============================================================

-- Admin (password: password123)
INSERT INTO "Admin" ("name", "email", "password") VALUES
('Admin Mie Gacoan', 'admin@miegacoan.com', '$2a$10$3v2SM5aD7ciS7hhcFXjKbOHnxAVO0eMCLkKr6iQMVgmGCnuE9/0eK');

-- Site Contents
INSERT INTO "SiteContent" ("key", "value") VALUES
('welcome_quote',        'Selamat Datang di Mie Gacoan!'),
('welcome_desc',         'Mie Gacoan hadir dengan semangat memberi pengalaman bersantap modern, terjangkau, dan selalu bikin ketagihan.'),
('visi',                 'Menjadi jaringan restoran mie pedas terbesar dan terpercaya di Indonesia.'),
('misi_1',               'Menyajikan mie pedas berkualitas dengan harga terjangkau'),
('misi_2',               'Menghadirkan pengalaman bersantap modern'),
('misi_3',               'Terus berinovasi dalam menu dan layanan'),
('nilai_1',              'Pedas'),
('nilai_2',              'Murah'),
('nilai_3',              'Nagih'),
('nilai_4',              'Modern'),
('nilai_5',              'Untuk Semua'),
('about_desc',           'Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Berdiri sejak tahun 2016, kami terus menyajikan kebahagiaan lewat sepiring mie pedas dan dimsum lezat bagi jutaan pelanggan di seluruh penjuru negeri.'),
('about_cabang',         '500+'),
('about_tahun',          '2016'),
('about_pelanggan',      '1 Juta+'),
('hero_info_jam',        '10.00 – 22.00'),
('hero_info_cabang',     '500+'),
('hero_info_harga',      '14rb'),
('footer_tagline',       'Pedas, Murah, Bikin Nagih'),
('lokasi_embed_url',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid'),
('lokasi_directions_url','https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA');

-- Social Media
INSERT INTO "SocialMedia" ("name", "icon", "url", "isActive", "order") VALUES
('Instagram', 'Instagram', 'https://www.instagram.com/mie.gacoan/',                            TRUE, 1),
('TikTok',    'Music2',    'https://www.tiktok.com/@miegacoanofficial',                          TRUE, 2),
('X',         'Twitter',   'https://x.com/mie_gacoan',                                          TRUE, 3),
('Facebook',  'Facebook',  'https://www.facebook.com/miegacoanofficial/?locale=id_ID',           TRUE, 4);

-- Menu Items
INSERT INTO "Menu" ("name", "slug", "category", "description", "price", "spicyLevel", "image", "isActive") VALUES
('Mie Suit',       'mie-suit',       'mie',     'Mie polos gurih lembut dibumburi racikan rahasia, ditaburi ayam cincang halus, bawang goreng, dan daun bawang segar. Nikmat gurih asli tanpa rasa pedas sama sekali.',                          12000, 0, '/uploads/menus/mie-suit.png',       TRUE),
('Mie Hompimpa',   'mie-hompimpa',   'mie',     'Mie pedas gurih asin khas Mie Gacoan. Disajikan dengan taburan ayam cincang melimpah, daun bawang segar, dan 2 keping kerupuk pangsit renyah tiada tanding.',                                   14000, 3, '/uploads/menus/mie-hompimpa.png',   TRUE),
('Mie Gacoan',     'mie-gacoan',     'mie',     'Menu andalan kami! Mie pedas manis gurih berpadu dengan kecap manis pilihan, ditaburi ayam cincang lembut, daun bawang, dan pangsit goreng super renyah.',                                       14000, 4, '/uploads/menus/mie-gacoan.png',     TRUE),
('Udang Rambutan', 'udang-rambutan', 'dimsum',  'Dimsum bola udang goreng yang dibungkus dengan rajangan kulit pangsit renyah menyerupai buah rambutan. Sensasi krispi di luar dan super lembut berdaging di dalam.',                             11000, 0, '/uploads/menus/udang-rambutan.png', TRUE),
('Udang Keju',     'udang-keju',     'dimsum',  'Olahan udang lembut dibalut tepung roti renyah berbentuk bulat lonjong dengan kejutan keju mozarella meleleh yang lumer lumer manis di dalamnya.',                                               11000, 0, '/uploads/menus/udang-keju.png',     TRUE),
('Es Gobak Sodor', 'es-gobak-sodor', 'minuman', 'Minuman es buah segar berpadu susu kental manis, cincau hitam lembut, nata de coco kenyal, jelly kelapa, buah tropis segar, serta sirup khas merah menyala.',                                   10000, 0, '/uploads/menus/es-gobak-sodor.png', TRUE),
('Es Genderuwo',   'es-genderuwo',   'minuman', 'Es pelepas dahaga nomor satu! Porsi besar serutan es manis bersirup mawar merah dengan campuran potongan agar-agar jelly warna-warni, nata de coco segar, dan selasih.',                        10000, 0, '/uploads/menus/es-genderuwo.png',   TRUE);

-- Packages
INSERT INTO "Package" ("name", "description", "price", "badge", "image", "isActive") VALUES
('Paket Mabar',   'Solusi nongkrong asyik berdua! Dapatkan 2 porsi Mie (bebas pilih Mie Hompimpa atau Mie Gacoan), 1 porsi Udang Keju lumer, dan 2 gelas Es Gobak Sodor manis segar.', 45000, 'Paling Populer', '/uploads/packages/paket-mabar.png',   TRUE),
('Paket Kenyang', 'Makan kenyang sendirian tanpa bikin dompet nangis! Combo 1 porsi Mie Gacoan manis pedas, 1 porsi Udang Rambutan krispi, dan 1 porsi Es Genderuwo jumbo pelepas pedas.', 32000, 'Hemat Juara', '/uploads/packages/paket-kenyang.png', TRUE);

-- Outlets
INSERT INTO "Outlet" ("name", "city", "address", "openTime", "mapsUrl", "isOpen") VALUES
('Mie Gacoan Kuningan', 'Jakarta', 'Jl. Prof. DR. Satrio No.18, Kuningan, Karet Kuningan, Kecamatan Setiabudi, Jakarta Selatan', '10.00 – 22.00', 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA', TRUE),
('Mie Gacoan Margonda', 'Depok',   'Jl. Margonda Raya No. 23, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat',              '09.00 – 23.00', 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA', TRUE),
('Mie Gacoan Dago',     'Bandung', 'Jl. Ir. H. Juanda No.145, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat',       '10.00 – 22.00', 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA', TRUE);

-- Gallery
INSERT INTO "Gallery" ("image", "caption", "category", "order") VALUES
('/uploads/galleries/gacoan-ambience.png', 'Desain interior outlet Mie Gacoan yang modern, bersih, berlampu hangat, dan sangat nyaman untuk berkumpul.',          'Outlet',  1),
('/uploads/galleries/gacoan-kitchen.png',  'Proses penyiapan hidangan mie segar secara higienis oleh tim dapur profesional kami setiap hari.',                    'Dapur',   2),
('/uploads/galleries/gacoan-crowd.png',    'Senyum ceria kehangatan berkumpul bersama teman sambil menikmati sensasi pedas mantap di sore hari.',                 'Momen',   3),
('/uploads/galleries/gacoan-food.png',     'Close-up kelezatan sepiring Mie Gacoan manis pedas bertabur topping ayam cincang melimpah yang menggoda selera.',     'Makanan', 4),
('/uploads/galleries/gacoan-dimsum.png',   'Cemilan wajib Udang Keju hangat berbalut tepung krispi dengan keju mozzarella meleleh di dalam.',                    'Dimsum',  5),
('/uploads/galleries/gacoan-drink.png',    'Segarnya racikan buah, jelly kenyal, sirup mawar merah Es Genderuwo untuk meredakan kepedasan Anda.',                 'Minuman', 6);

-- Testimonials
INSERT INTO "Testimonial" ("name", "rating", "content") VALUES
('Rian Prasetya',  5, 'Mie Gacoan level 3 selalu jadi andalan saya tiap akhir pekan! Pedas gurihnya pas banget, ditambah dimsum Udang Rambutan krispi luar biasa. Harganya sangat merakyat.'),
('Siti Rahmawati', 5, 'Tempatnya luas banget, pas buat arisan atau sekadar nugas kuliah. Favorit saya Udang Keju lumernya, kejunya molor banget! Es Gobak Sodornya juga juara segar manisnya.'),
('Andi Wijaya',    5, 'Pelayanannya cepat sekali walaupun antrian selalu ramai mengular. Karyawannya ramah-ramah. Mie Suit-nya aman buat anak saya yang tidak bisa makan pedas.'),
('Clara Amanda',   4, 'Es Genderuwo-nya segar parah, isinya buah jackfruit manis dan agar-agar melimpah. Cocok banget dipadukan dengan kepedasan Mie Hompimpa level 4. Nagih banget!'),
('Budi Santoso',   5, 'Sangat direkomendasikan! Cita rasa mie pedas No. 1 dengan kebersihan outlet yang terus terjaga dengan baik. Selalu rindu rasa pedas manis khas Mie Gacoan.');

-- ============================================================
-- 4. AUTO-UPDATE TIMESTAMP TRIGGERS (disarankan)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_admin_updated_at       BEFORE UPDATE ON "Admin"       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sitecontent_updated_at BEFORE UPDATE ON "SiteContent" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_heroslide_updated_at   BEFORE UPDATE ON "HeroSlide"   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_socialmedia_updated_at BEFORE UPDATE ON "SocialMedia" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_menu_updated_at        BEFORE UPDATE ON "Menu"        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_package_updated_at     BEFORE UPDATE ON "Package"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_outlet_updated_at      BEFORE UPDATE ON "Outlet"      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_gallery_updated_at     BEFORE UPDATE ON "Gallery"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_testimonial_updated_at BEFORE UPDATE ON "Testimonial" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
