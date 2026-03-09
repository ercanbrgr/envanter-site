-- ===================================
-- REÇETE TABLOSUNU GÜNCELLE
-- ===================================

-- ÖNCE ESKİ KAYITLARI SİL
DELETE FROM urun_recete WHERE urun_adi IN (
  'BIG SPECIAL PEYNIR', 'RED ZONE MENÜ', 'PAKET RAMAZAN JOKE', 
  'ALGIDA JOKER CHEES', 'RAMAZAN ETLI MENÜ', 'RAMAZAN ÇORBALI TA',
  'JOKER ALEV ALEV BU', 'RAMAZAN TAVUKLU ME', 'TASTY ALEV ALEV BU',
  'JUNIOR ET BURGER M', 'GURME İKİLİ', 'TOK EDEN MENU',
  'ÇITIR TAVUK TABAĞI', '12''LI SOĞAN HALKA', '6''LI STICK PEYNIR',
  '4''LÜ NUGGETT', 'SODA', 'MENÜ COLA P.'
);

-- YENİ REÇETELERI EKLE
INSERT INTO urun_recete (urun_adi, malzeme_adi, miktar, birim, aktif) VALUES

-- BIG SPECIAL PEYNİR
('BIG SPECIAL PEYNIR', 'Ekmek', 1, 'adet', true),
('BIG SPECIAL PEYNIR', 'Super Et (120gr)', 120, 'gr', true),
('BIG SPECIAL PEYNIR', 'Cheddar Peynir', 30, 'gr', true),
('BIG SPECIAL PEYNIR', 'Burger Sos', 30, 'gr', true),

-- RED ZONE MENÜ
('RED ZONE MENÜ', 'Ekmek', 1, 'adet', true),
('RED ZONE MENÜ', 'Tavuk Burger (120gr)', 120, 'gr', true),
('RED ZONE MENÜ', 'Patates', 130, 'gr', true),
('RED ZONE MENÜ', 'Kutu İçecek', 1, 'adet', true),
('RED ZONE MENÜ', 'Ranch Sos', 30, 'gr', true),

-- PAKET RAMAZAN JOKE
('PAKET RAMAZAN JOKE', 'Ekmek', 1, 'adet', true),
('PAKET RAMAZAN JOKE', 'Joker Et (85gr)', 85, 'gr', true),
('PAKET RAMAZAN JOKE', 'Patates', 130, 'gr', true),
('PAKET RAMAZAN JOKE', 'Su', 1, 'adet', true),
('PAKET RAMAZAN JOKE', 'Kutu İçecek', 1, 'adet', true),
('PAKET RAMAZAN JOKE', 'Burger Sos', 30, 'gr', true),

-- ALGIDA JOKER CHEES
('ALGIDA JOKER CHEES', 'Ekmek', 1, 'adet', true),
('ALGIDA JOKER CHEES', 'Joker Et (85gr)', 85, 'gr', true),
('ALGIDA JOKER CHEES', 'Cheddar Peynir', 30, 'gr', true),
('ALGIDA JOKER CHEES', 'Burger Sos', 30, 'gr', true),

-- RAMAZAN ETLI MENÜ
('RAMAZAN ETLI MENÜ', 'Ekmek', 1, 'adet', true),
('RAMAZAN ETLI MENÜ', 'Joker Et (85gr)', 85, 'gr', true),
('RAMAZAN ETLI MENÜ', 'Patates', 130, 'gr', true),
('RAMAZAN ETLI MENÜ', 'Su', 1, 'adet', true),
('RAMAZAN ETLI MENÜ', 'Kutu İçecek', 1, 'adet', true),
('RAMAZAN ETLI MENÜ', 'Burger Sos', 30, 'gr', true),

-- RAMAZAN ÇORBALI TA
('RAMAZAN ÇORBALI TA', 'Ekmek', 1, 'adet', true),
('RAMAZAN ÇORBALI TA', 'Tenders (120gr)', 120, 'gr', true),
('RAMAZAN ÇORBALI TA', 'Patates', 130, 'gr', true),
('RAMAZAN ÇORBALI TA', 'Su', 1, 'adet', true),
('RAMAZAN ÇORBALI TA', 'Kutu İçecek', 1, 'adet', true),
('RAMAZAN ÇORBALI TA', 'Ranch Sos', 30, 'gr', true),

-- JOKER ALEV ALEV BU
('JOKER ALEV ALEV BU', 'Ekmek', 1, 'adet', true),
('JOKER ALEV ALEV BU', 'Joker Et (85gr)', 85, 'gr', true),
('JOKER ALEV ALEV BU', 'Acı Sos', 40, 'gr', true),

-- RAMAZAN TAVUKLU ME
('RAMAZAN TAVUKLU ME', 'Ekmek', 1, 'adet', true),
('RAMAZAN TAVUKLU ME', 'Tenders (120gr)', 120, 'gr', true),
('RAMAZAN TAVUKLU ME', 'Patates', 130, 'gr', true),
('RAMAZAN TAVUKLU ME', 'Su', 1, 'adet', true),
('RAMAZAN TAVUKLU ME', 'Kutu İçecek', 1, 'adet', true),
('RAMAZAN TAVUKLU ME', 'Ranch Sos', 30, 'gr', true),

-- TASTY ALEV ALEV BU
('TASTY ALEV ALEV BU', 'Ekmek', 1, 'adet', true),
('TASTY ALEV ALEV BU', 'Tasty Et (150gr)', 150, 'gr', true),
('TASTY ALEV ALEV BU', 'Acı Sos', 40, 'gr', true),

-- JUNIOR ET BURGER M
('JUNIOR ET BURGER M', 'Ekmek', 1, 'adet', true),
('JUNIOR ET BURGER M', 'Mini Et (60gr)', 60, 'gr', true),
('JUNIOR ET BURGER M', 'Patates', 130, 'gr', true),
('JUNIOR ET BURGER M', 'Kutu İçecek', 1, 'adet', true),
('JUNIOR ET BURGER M', 'Burger Sos', 30, 'gr', true),

-- GURME İKİLİ
('GURME İKİLİ', 'Ekmek', 2, 'adet', true),
('GURME İKİLİ', 'Joker Smoky Et (85gr)', 170, 'gr', true),
('GURME İKİLİ', 'Patates', 260, 'gr', true),
('GURME İKİLİ', 'Kutu İçecek', 2, 'adet', true),

-- TOK EDEN MENU
('TOK EDEN MENU', 'Makarna', 1, 'porsiyon', true),
('TOK EDEN MENU', 'Kutu İçecek', 1, 'adet', true),

-- ÇITIR TAVUK TABAĞI
('ÇITIR TAVUK TABAĞI', 'Tavuk Parçası', 6, 'adet', true),
('ÇITIR TAVUK TABAĞI', 'Patates', 130, 'gr', true),

-- 12'LI SOĞAN HALKA
('12''LI SOĞAN HALKA', 'Soğan Halkası', 12, 'adet', true),

-- 6'LI STICK PEYNIR
('6''LI STICK PEYNIR', 'Stick Peynir', 6, 'adet', true),

-- 4'LÜ NUGGETT
('4''LÜ NUGGETT', 'Nugget', 4, 'adet', true),

-- SODA
('SODA', 'Soda', 1, 'adet', true),

-- MENÜ COLA P.
('MENÜ COLA P.', '1 Litre İçecek', 1, 'adet', true);

-- ===================================
-- RLS KAPAT (ŞUBE ONAY SİSTEMİ İÇİN)
-- ===================================
ALTER TABLE sube_profiller DISABLE ROW LEVEL SECURITY;
