-- sube_user_id kolonu ekle (yoksa)
ALTER TABLE sarf_ozeti ADD COLUMN IF NOT EXISTS sube_user_id uuid REFERENCES auth.users(id);

-- Eski unique constraint kaldır
ALTER TABLE sarf_ozeti DROP CONSTRAINT IF EXISTS sarf_ozeti_user_id_tarih_key;

-- Yeni unique constraint ekle
ALTER TABLE sarf_ozeti DROP CONSTRAINT IF EXISTS sarf_ozeti_user_sube_tarih_key;
ALTER TABLE sarf_ozeti ADD CONSTRAINT sarf_ozeti_user_sube_tarih_key UNIQUE(user_id, sube_user_id, tarih);

-- RLS policy güncelle (admin tüm sarf kayıtlarını görebilsin)
DROP POLICY IF EXISTS "Users can manage own sarf" ON sarf_ozeti;

CREATE POLICY "Users manage sarf" ON sarf_ozeti
  FOR ALL USING (
    auth.uid() = user_id
  );
