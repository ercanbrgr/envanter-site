-- ═══════════════════════════════════════════════════════════
-- 🔧 ŞUBE ONAY SİSTEMİ RLS POLİTİKASI DÜZELTMESİ
-- ═══════════════════════════════════════════════════════════
-- Sorun: Admin kullanıcıları şubeleri onaylayamıyor
-- Çözüm: Admin ve Super Admin'lerin UPDATE yetkisi ekleniyor
-- ═══════════════════════════════════════════════════════════

-- Önce mevcut politikaları kontrol et (silme işlemi için)
DROP POLICY IF EXISTS "Admin onay update" ON sube_profiller;
DROP POLICY IF EXISTS "Admin can approve" ON sube_profiller;
DROP POLICY IF EXISTS "Admin can update profiles" ON sube_profiller;

-- ✅ YENİ POLİTİKA: Admin ve Super Admin UPDATE yapabilir
CREATE POLICY "Admin can update sube profil"
ON sube_profiller
FOR UPDATE
USING (
  -- Sadece admin veya super_admin rolündeki kullanıcılar
  EXISTS (
    SELECT 1 FROM sube_profiller
    WHERE user_id = auth.uid()
    AND rol IN ('admin', 'super_admin')
  )
);

-- ✅ BONUS: Admin ve Super Admin tüm profilleri görebilir (SELECT)
DROP POLICY IF EXISTS "Admin can select all profiles" ON sube_profiller;
CREATE POLICY "Admin can select all profiles"
ON sube_profiller
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM sube_profiller
    WHERE user_id = auth.uid()
    AND rol IN ('admin', 'super_admin')
  )
  OR user_id = auth.uid() -- Kendi profilini görebilir
);

-- ═══════════════════════════════════════════════════════════
-- ✅ TAMAMLANDI
-- ═══════════════════════════════════════════════════════════
-- Test etmek için:
-- 1. Admin hesabıyla giriş yap
-- 2. Bekleyen Onaylar sayfasını aç
-- 3. "Onayla" butonuna tıkla
-- 4. Şube artık giriş yapabilmeli
-- ═══════════════════════════════════════════════════════════
