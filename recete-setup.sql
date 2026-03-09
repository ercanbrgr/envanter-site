-- BRGR Envanter - Reçete Yönetim Sistemi
-- Tarih: 2026-03-09

-- 1. Merkezi ürün reçete tablosu
CREATE TABLE IF NOT EXISTS urun_recete (
  id BIGSERIAL PRIMARY KEY,
  urun_adi TEXT NOT NULL,
  malzeme_adi TEXT NOT NULL,
  miktar NUMERIC NOT NULL,
  birim TEXT DEFAULT 'gr',
  kategori TEXT,
  notlar TEXT,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Şube özel reçete tablosu (override için)
CREATE TABLE IF NOT EXISTS sube_recete (
  id BIGSERIAL PRIMARY KEY,
  sube_id BIGINT REFERENCES sube_profiller(id) ON DELETE CASCADE,
  urun_adi TEXT NOT NULL,
  malzeme_adi TEXT NOT NULL,
  miktar NUMERIC NOT NULL,
  birim TEXT DEFAULT 'gr',
  notlar TEXT,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sube_id, urun_adi, malzeme_adi)
);

-- 3. RLS Politikaları
ALTER TABLE urun_recete ENABLE ROW LEVEL SECURITY;
ALTER TABLE sube_recete ENABLE ROW LEVEL SECURITY;

-- Herkes merkezi reçeteyi okuyabilir
DROP POLICY IF EXISTS "Herkes okur" ON urun_recete;
CREATE POLICY "Herkes okur" ON urun_recete 
  FOR SELECT USING (true);

-- Sadece admin merkezi reçeteyi düzenleyebilir
DROP POLICY IF EXISTS "Admin yazar" ON urun_recete;
CREATE POLICY "Admin yazar" ON urun_recete 
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM sube_profiller WHERE rol = 'admin')
  );

-- Herkes kendi şubesinin özel reçetesini okuyabilir
DROP POLICY IF EXISTS "Kendi şubesini okur" ON sube_recete;
CREATE POLICY "Kendi şubesini okur" ON sube_recete 
  FOR SELECT USING (
    sube_id IN (SELECT id FROM sube_profiller WHERE user_id = auth.uid())
  );

-- Admin kendi şubesinin özel reçetesini düzenleyebilir
DROP POLICY IF EXISTS "Admin düzenler" ON sube_recete;
CREATE POLICY "Admin düzenler" ON sube_recete 
  FOR ALL USING (
    sube_id IN (SELECT id FROM sube_profiller WHERE user_id = auth.uid() AND rol = 'admin')
  );

-- 4. İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_urun_recete_urun ON urun_recete(urun_adi) WHERE aktif = true;
CREATE INDEX IF NOT EXISTS idx_sube_recete_sube_urun ON sube_recete(sube_id, urun_adi) WHERE aktif = true;

-- 5. Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_urun_recete_updated_at ON urun_recete;
CREATE TRIGGER update_urun_recete_updated_at 
  BEFORE UPDATE ON urun_recete 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sube_recete_updated_at ON sube_recete;
CREATE TRIGGER update_sube_recete_updated_at 
  BEFORE UPDATE ON sube_recete 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- BAŞARILI! Artık Supabase Dashboard'dan bu sorguyu çalıştırabilirsiniz.
