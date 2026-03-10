-- ========================================
-- ERCAN BRGR REÇETE TEMİZLEME VE YENİDEN EKLEME
-- ========================================
-- UYARI: Bu SQL önce tüm reçeteleri siler, sonra doğru olanları ekler
-- Çalıştırmadan önce yedek almayı unutma (SQL Editor → Export CSV)

-- 1️⃣ ÖNCE TÜM REÇETELERİ TEMİZLE
DELETE FROM urun_recete;

-- 2️⃣ YENİ REÇETELERİ EKLE (User Prompt #229'dan)

-- ========================================
-- JOKER BURGERLER (85 GR)
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('JOKER CLASSIC BURG', 'Ekmek', 1, 'adet'),
('JOKER CLASSIC BURG', 'Joker Et (85gr)', 85, 'gr'),
('JOKER CLASSIC BURG', 'Burger Sos', 30, 'gr'),

('JOKER CHEESE BURGE', 'Ekmek', 1, 'adet'),
('JOKER CHEESE BURGE', 'Joker Et (85gr)', 85, 'gr'),
('JOKER CHEESE BURGE', 'Cheddar Peyniri', 30, 'gr'),
('JOKER CHEESE BURGE', 'Burger Sos', 30, 'gr'),

('JOKER SMOKY BBQ BU', 'Ekmek', 1, 'adet'),
('JOKER SMOKY BBQ BU', 'Joker Et (85gr)', 85, 'gr'),
('JOKER SMOKY BBQ BU', 'Burger Sos', 30, 'gr'),

('JOKER MUSHROOM BUR', 'Ekmek', 1, 'adet'),
('JOKER MUSHROOM BUR', 'Joker Et (85gr)', 85, 'gr'),
('JOKER MUSHROOM BUR', 'Trüflü Mayonez', 20, 'gr'),
('JOKER MUSHROOM BUR', 'Mantar', 20, 'gr'),

('JOKER ALEV ALEV BU', 'Ekmek', 1, 'adet'),
('JOKER ALEV ALEV BU', 'Joker Et (85gr)', 85, 'gr'),
('JOKER ALEV ALEV BU', 'Acı Sos', 40, 'gr'),

('JOKER DOUBLE BURGE', 'Ekmek', 1, 'adet'),
('JOKER DOUBLE BURGE', 'Joker Et (85gr)', 170, 'gr'),
('JOKER DOUBLE BURGE', 'Burger Sos', 30, 'gr'),

('JOKER ANATOLIAN BU', 'Ekmek', 1, 'adet'),
('JOKER ANATOLIAN BU', 'Joker Et (85gr)', 85, 'gr'),
('JOKER ANATOLIAN BU', 'Burger Sos', 30, 'gr');

-- ========================================
-- SUPER BURGERLER (120 GR)
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('SUPPER CLASSIC BUR', 'Ekmek', 1, 'adet'),
('SUPPER CLASSIC BUR', 'Super Et (120gr)', 120, 'gr'),
('SUPPER CLASSIC BUR', 'Burger Sos', 30, 'gr'),

('SUPPER CHEESE BURG', 'Ekmek', 1, 'adet'),
('SUPPER CHEESE BURG', 'Super Et (120gr)', 120, 'gr'),
('SUPPER CHEESE BURG', 'Cheddar Peyniri', 30, 'gr'),
('SUPPER CHEESE BURG', 'Burger Sos', 30, 'gr'),

('SUPPER SMOKY BBQ B', 'Ekmek', 1, 'adet'),
('SUPPER SMOKY BBQ B', 'Super Et (120gr)', 120, 'gr'),
('SUPPER SMOKY BBQ B', 'Burger Sos', 30, 'gr'),

('SUPPER MUSHROOM BU', 'Ekmek', 1, 'adet'),
('SUPPER MUSHROOM BU', 'Super Et (120gr)', 120, 'gr'),
('SUPPER MUSHROOM BU', 'Trüflü Mayonez', 20, 'gr'),
('SUPPER MUSHROOM BU', 'Mantar', 20, 'gr'),

('SUPPER ALEV ALEV B', 'Ekmek', 1, 'adet'),
('SUPPER ALEV ALEV B', 'Super Et (120gr)', 120, 'gr'),
('SUPPER ALEV ALEV B', 'Acı Sos', 40, 'gr'),

('SUPPER DOUBLE BURG', 'Ekmek', 1, 'adet'),
('SUPPER DOUBLE BURG', 'Super Et (120gr)', 240, 'gr'),
('SUPPER DOUBLE BURG', 'Burger Sos', 30, 'gr');

-- ========================================
-- TASTY BURGERLER (150 GR)
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('TASTY CLASSIC BURG', 'Ekmek', 1, 'adet'),
('TASTY CLASSIC BURG', 'Tasty Et (150gr)', 150, 'gr'),
('TASTY CLASSIC BURG', 'Burger Sos', 30, 'gr'),

('TASTY CHEESE BURGE', 'Ekmek', 1, 'adet'),
('TASTY CHEESE BURGE', 'Tasty Et (150gr)', 150, 'gr'),
('TASTY CHEESE BURGE', 'Cheddar Peyniri', 30, 'gr'),
('TASTY CHEESE BURGE', 'Burger Sos', 30, 'gr'),

('TASTY SMOKY BBQ BU', 'Ekmek', 1, 'adet'),
('TASTY SMOKY BBQ BU', 'Tasty Et (150gr)', 150, 'gr'),
('TASTY SMOKY BBQ BU', 'Burger Sos', 30, 'gr'),

('TASTY MUSHROOM BUR', 'Ekmek', 1, 'adet'),
('TASTY MUSHROOM BUR', 'Tasty Et (150gr)', 150, 'gr'),
('TASTY MUSHROOM BUR', 'Trüflü Mayonez', 20, 'gr'),
('TASTY MUSHROOM BUR', 'Mantar', 20, 'gr'),

('TASTY ALEV ALEV BU', 'Ekmek', 1, 'adet'),
('TASTY ALEV ALEV BU', 'Tasty Et (150gr)', 150, 'gr'),
('TASTY ALEV ALEV BU', 'Acı Sos', 40, 'gr');

-- ========================================
-- TAVUK BURGERLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('CHICKEN BURGER', 'Ekmek', 1, 'adet'),
('CHICKEN BURGER', 'Tavuk Burger (120gr)', 120, 'gr'),
('CHICKEN BURGER', 'Ranch Sos', 30, 'gr'),

('CHICKEN TENDERS BU', 'Ekmek', 1, 'adet'),
('CHICKEN TENDERS BU', 'Tenders (160gr)', 160, 'gr'),
('CHICKEN TENDERS BU', 'Ranch Sos', 30, 'gr'),

('CHEDDAR CHICKEN', 'Ekmek', 1, 'adet'),
('CHEDDAR CHICKEN', 'Tavuk Burger (120gr)', 120, 'gr'),
('CHEDDAR CHICKEN', 'Cheddar Peyniri', 30, 'gr'),
('CHEDDAR CHICKEN', 'Ranch Sos', 30, 'gr');

-- ========================================
-- RAMAZAN MENÜLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('PAKET RAMAZAN JOKE', 'Ekmek', 1, 'adet'),
('PAKET RAMAZAN JOKE', 'Joker Et (85gr)', 85, 'gr'),
('PAKET RAMAZAN JOKE', 'Patates', 130, 'gr'),
('PAKET RAMAZAN JOKE', 'Su', 1, 'adet'),
('PAKET RAMAZAN JOKE', 'Kutu İçecek', 1, 'adet'),
('PAKET RAMAZAN JOKE', 'Burger Sos', 30, 'gr'),

('RAMAZAN ETLI MENÜ', 'Ekmek', 1, 'adet'),
('RAMAZAN ETLI MENÜ', 'Joker Et (85gr)', 85, 'gr'),
('RAMAZAN ETLI MENÜ', 'Patates', 130, 'gr'),
('RAMAZAN ETLI MENÜ', 'Su', 1, 'adet'),
('RAMAZAN ETLI MENÜ', 'Kutu İçecek', 1, 'adet'),
('RAMAZAN ETLI MENÜ', 'Burger Sos', 30, 'gr'),

('RAMAZAN CORBALI TA', 'Ekmek', 1, 'adet'),
('RAMAZAN CORBALI TA', 'Tenders (160gr)', 160, 'gr'),
('RAMAZAN CORBALI TA', 'Patates', 130, 'gr'),
('RAMAZAN CORBALI TA', 'Su', 1, 'adet'),
('RAMAZAN CORBALI TA', 'Kutu İçecek', 1, 'adet'),
('RAMAZAN CORBALI TA', 'Ranch Sos', 30, 'gr'),

('RAMAZAN TAVUKLU ME', 'Ekmek', 1, 'adet'),
('RAMAZAN TAVUKLU ME', 'Tenders (160gr)', 160, 'gr'),
('RAMAZAN TAVUKLU ME', 'Patates', 130, 'gr'),
('RAMAZAN TAVUKLU ME', 'Su', 1, 'adet'),
('RAMAZAN TAVUKLU ME', 'Kutu İçecek', 1, 'adet'),
('RAMAZAN TAVUKLU ME', 'Ranch Sos', 30, 'gr');

-- ========================================
-- DİĞER ÖZEL ÜRÜNLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('BIG SPECIAL PEYNIR', 'Ekmek', 1, 'adet'),
('BIG SPECIAL PEYNIR', 'Special Et (150gr)', 150, 'gr'),
('BIG SPECIAL PEYNIR', 'Cheddar Peyniri', 30, 'gr'),
('BIG SPECIAL PEYNIR', 'Burger Sos', 30, 'gr'),

('BIG SPECIAL PEYNİR', 'Ekmek', 1, 'adet'),
('BIG SPECIAL PEYNİR', 'Special Et (150gr)', 150, 'gr'),
('BIG SPECIAL PEYNİR', 'Cheddar Peyniri', 30, 'gr'),
('BIG SPECIAL PEYNİR', 'Burger Sos', 30, 'gr'),

('RED ZONE MENÜ', 'Ekmek', 1, 'adet'),
('RED ZONE MENÜ', 'Tavuk Burger (120gr)', 120, 'gr'),
('RED ZONE MENÜ', 'Patates', 130, 'gr'),
('RED ZONE MENÜ', 'Kutu İçecek', 1, 'adet'),
('RED ZONE MENÜ', 'Red Zone Sos', 30, 'gr'),

('RED ZONE TAVUK BUR', 'Ekmek', 1, 'adet'),
('RED ZONE TAVUK BUR', 'Tavuk Burger (120gr)', 120, 'gr'),
('RED ZONE TAVUK BUR', 'Red Zone Sos', 30, 'gr'),

('JUNIOR ET BURGER M', 'Ekmek', 1, 'adet'),
('JUNIOR ET BURGER M', 'Mini Et (50gr)', 50, 'gr'),
('JUNIOR ET BURGER M', 'Patates', 130, 'gr'),
('JUNIOR ET BURGER M', 'Kutu İçecek', 1, 'adet'),

('JUNIOR TAVUK BURGE', 'Ekmek', 1, 'adet'),
('JUNIOR TAVUK BURGE', 'Mini Tavuk (65gr)', 65, 'gr'),
('JUNIOR TAVUK BURGE', 'Patates', 130, 'gr'),
('JUNIOR TAVUK BURGE', 'Kutu İçecek', 1, 'adet'),

('GURME IKILI', 'Ekmek', 2, 'adet'),
('GURME IKILI', 'Joker Et (85gr)', 170, 'gr'),
('GURME IKILI', 'Patates', 260, 'gr'),
('GURME IKILI', 'Kutu İçecek', 2, 'adet'),
('GURME IKILI', 'Burger Sos', 30, 'gr'),

('GURME İKİLİ', 'Ekmek', 2, 'adet'),
('GURME İKİLİ', 'Joker Et (85gr)', 170, 'gr'),
('GURME İKİLİ', 'Patates', 260, 'gr'),
('GURME İKİLİ', 'Kutu İçecek', 2, 'adet'),
('GURME İKİLİ', 'Burger Sos', 30, 'gr'),

('TOK EDEN MENU', 'Makarna', 1, 'adet'),
('TOK EDEN MENU', 'Kutu İçecek', 1, 'adet'),

('Tok Eden Menu', 'Makarna', 1, 'adet'),
('Tok Eden Menu', 'Kutu İçecek', 1, 'adet'),

('GOLDEN BURGER', 'Ekmek', 1, 'adet'),

('GOLDEN BURGER MENU', 'Ekmek', 1, 'adet'),
('GOLDEN BURGER MENU', 'Patates', 130, 'gr'),
('GOLDEN BURGER MENU', 'Kutu İçecek', 1, 'adet'),

('EFSANE UCLU TAVUK', 'Ekmek', 3, 'adet'),
('EFSANE UCLU TAVUK', 'Tavuk Burger (120gr)', 360, 'gr'),
('EFSANE UCLU TAVUK', 'Patates', 390, 'gr'),
('EFSANE UCLU TAVUK', '1 Litre İçecek', 1, 'adet');

-- ========================================
-- İKİLİ MENÜLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('2 LI JOKER CLASSIC', 'Ekmek', 2, 'adet'),
('2 LI JOKER CLASSIC', 'Joker Et (85gr)', 170, 'gr'),
('2 LI JOKER CLASSIC', 'Patates', 260, 'gr'),
('2 LI JOKER CLASSIC', 'Kutu İçecek', 2, 'adet'),
('2 LI JOKER CLASSIC', 'Burger Sos', 60, 'gr'),

('2 Lİ JOKER CLASSIC', 'Ekmek', 2, 'adet'),
('2 Lİ JOKER CLASSIC', 'Joker Et (85gr)', 170, 'gr'),
('2 Lİ JOKER CLASSIC', 'Patates', 260, 'gr'),
('2 Lİ JOKER CLASSIC', 'Kutu İçecek', 2, 'adet'),
('2 Lİ JOKER CLASSIC', 'Burger Sos', 60, 'gr'),

('2 LI JOKER CHEESE', 'Ekmek', 2, 'adet'),
('2 LI JOKER CHEESE', 'Joker Et (85gr)', 170, 'gr'),
('2 LI JOKER CHEESE', 'Cheddar Peyniri', 60, 'gr'),
('2 LI JOKER CHEESE', 'Patates', 260, 'gr'),
('2 LI JOKER CHEESE', 'Kutu İçecek', 2, 'adet'),
('2 LI JOKER CHEESE', 'Burger Sos', 60, 'gr'),

('2 Lİ JOKER CHEESE', 'Ekmek', 2, 'adet'),
('2 Lİ JOKER CHEESE', 'Joker Et (85gr)', 170, 'gr'),
('2 Lİ JOKER CHEESE', 'Cheddar Peyniri', 60, 'gr'),
('2 Lİ JOKER CHEESE', 'Patates', 260, 'gr'),
('2 Lİ JOKER CHEESE', 'Kutu İçecek', 2, 'adet'),
('2 Lİ JOKER CHEESE', 'Burger Sos', 60, 'gr'),

('2 LI CHICKEN BURGE', 'Ekmek', 2, 'adet'),
('2 LI CHICKEN BURGE', 'Tavuk Burger (120gr)', 240, 'gr'),
('2 LI CHICKEN BURGE', 'Patates', 260, 'gr'),
('2 LI CHICKEN BURGE', 'Kutu İçecek', 2, 'adet'),
('2 LI CHICKEN BURGE', 'Ranch Sos', 60, 'gr');

-- ========================================
-- ÜÇLÜ MENÜLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('3 LU JOKER CLASSIC', 'Ekmek', 3, 'adet'),
('3 LU JOKER CLASSIC', 'Joker Et (85gr)', 255, 'gr'),
('3 LU JOKER CLASSIC', 'Patates', 390, 'gr'),
('3 LU JOKER CLASSIC', '1 Litre İçecek', 1, 'adet'),
('3 LU JOKER CLASSIC', 'Burger Sos', 90, 'gr'),

('3 LU JOKER CHEESE', 'Ekmek', 3, 'adet'),
('3 LU JOKER CHEESE', 'Joker Et (85gr)', 255, 'gr'),
('3 LU JOKER CHEESE', 'Cheddar Peyniri', 90, 'gr'),
('3 LU JOKER CHEESE', 'Patates', 390, 'gr'),
('3 LU JOKER CHEESE', '1 Litre İçecek', 1, 'adet'),
('3 LU JOKER CHEESE', 'Burger Sos', 90, 'gr'),

('3 LÜ JOKER CHEESE', 'Ekmek', 3, 'adet'),
('3 LÜ JOKER CHEESE', 'Joker Et (85gr)', 255, 'gr'),
('3 LÜ JOKER CHEESE', 'Cheddar Peyniri', 90, 'gr'),
('3 LÜ JOKER CHEESE', 'Patates', 390, 'gr'),
('3 LÜ JOKER CHEESE', '1 Litre İçecek', 1, 'adet'),
('3 LÜ JOKER CHEESE', 'Burger Sos', 90, 'gr'),

('3 LU CHICKEN BURGE', 'Ekmek', 3, 'adet'),
('3 LU CHICKEN BURGE', 'Tavuk Burger (120gr)', 360, 'gr'),
('3 LU CHICKEN BURGE', 'Patates', 390, 'gr'),
('3 LU CHICKEN BURGE', '1 Litre İçecek', 1, 'adet'),
('3 LU CHICKEN BURGE', 'Ranch Sos', 90, 'gr'),

('3 LÜ CHICKEN BURGE', 'Ekmek', 3, 'adet'),
('3 LÜ CHICKEN BURGE', 'Tavuk Burger (120gr)', 360, 'gr'),
('3 LÜ CHICKEN BURGE', 'Patates', 390, 'gr'),
('3 LÜ CHICKEN BURGE', '1 Litre İçecek', 1, 'adet'),
('3 LÜ CHICKEN BURGE', 'Ranch Sos', 90, 'gr');

-- ========================================
-- APERATİFLER
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('CITIR TAVUK TABAGI', 'Tavuk Parçası', 6, 'adet'),
('CITIR TAVUK TABAGI', 'Patates', 130, 'gr'),

('ÇITIR TAVUK TABAĞI', 'Çıtır Tavuk (160gr)', 160, 'gr'),
('ÇITIR TAVUK TABAĞI', 'Patates', 130, 'gr'),

('12''LI SOGAN HALKA', 'Soğan Halkası', 12, 'adet'),
('12''Lİ SOĞAN HALKA', 'Soğan Halkası', 12, 'adet'),

('6''LI SOGAN HALKA', 'Soğan Halkası', 6, 'adet'),
('6''Lİ SOĞAN HALKASI', 'Soğan Halkası', 6, 'adet'),

('8''LI SOGAN HALKASI', 'Soğan Halkası', 8, 'adet'),
('8''Lİ SOĞAN HALKASI', 'Soğan Halkası', 8, 'adet'),

('6''LI STICK PEYNIR', 'Stick Peynir', 6, 'adet'),
('6''Lİ STICK PEYNIR', 'Stick Peynir', 6, 'adet'),

('4''LU STICK PEYNIR', 'Stick Peynir', 4, 'adet'),
('4''Lİ STICK PEYNIR', 'Stick Peynir', 4, 'adet'),

('3''LU STICK PEYNIR', 'Stick Peynir', 3, 'adet'),
('3''Lİ STICK PEYNIR', 'Stick Peynir', 3, 'adet'),

('4''LU NUGGETT', 'Nugget', 4, 'adet'),
('4''Lİ NUGGETT', 'Nugget', 4, 'adet'),

('6''LI NUGGET', 'Nugget', 6, 'adet'),
('6''Lİ NUGGET', 'Nugget', 6, 'adet'),

('8''LI NUGGET', 'Nugget', 8, 'adet'),
('8''Lİ NUGGET', 'Nugget', 8, 'adet'),

('MIX ATISTIRMALIK', 'Soğan Halkası', 4, 'adet'),
('MIX ATISTIRMALIK', 'Stick Peynir', 3, 'adet'),
('MIX ATISTIRMALIK', 'Nugget', 3, 'adet'),
('MIX ATISTIRMALIK', 'Patates', 130, 'gr'),

('MIX ATIŞTIRMALIK', 'Soğan Halkası', 4, 'adet'),
('MIX ATIŞTIRMALIK', 'Stick Peynir', 3, 'adet'),
('MIX ATIŞTIRMALIK', 'Nugget', 3, 'adet'),
('MIX ATIŞTIRMALIK', 'Patates', 130, 'gr'),

('PATATES KIZARTMASI', 'Patates', 130, 'gr'),
('DOUBLE PATATES KIZ', 'Patates', 260, 'gr');

-- ========================================
-- İÇECEKLER (menülere dahil olanlar zaten var)
-- ========================================
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim) VALUES
('MENÜ COLA P.', '1 Litre İçecek', 1, 'adet'),
('SODA', 'Soda', 1, 'adet'),
('SU', 'Su', 1, 'adet'),
('AYRAN', 'Ayran', 1, 'adet'),
('CAY', 'Çay', 1, 'adet');

-- ========================================
-- TEMİZLİK SONRASI KONTROL
-- ========================================
-- Şu sorgu ile kontrol et:
-- SELECT urun_adi, COUNT(*) as malzeme_sayisi 
-- FROM urun_recete 
-- GROUP BY urun_adi 
-- ORDER BY urun_adi;
