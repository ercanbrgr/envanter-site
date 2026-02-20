-- Şube profilleri tablosu
CREATE TABLE IF NOT EXISTS public.sube_profiller (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  sube_adi TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS public.urunler (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  sira INTEGER NOT NULL,
  ad TEXT NOT NULL,
  birim TEXT DEFAULT 'Adet',
  koli TEXT DEFAULT '',
  adet_koli TEXT DEFAULT '',
  UNIQUE(user_id, sira)
);

-- Günlük girişler tablosu
CREATE TABLE IF NOT EXISTS public.gunluk_girdiler (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  urun_sira INTEGER NOT NULL,
  gun TEXT DEFAULT '',
  tarih DATE,
  acilis TEXT DEFAULT '',
  gelen TEXT DEFAULT '',
  gelen_iade TEXT DEFAULT '',
  transfer TEXT DEFAULT '',
  kapanis TEXT DEFAULT '',
  mallara_gore TEXT DEFAULT '',
  zayi TEXT DEFAULT '',
  odenmez TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Güvenlik kuralları (RLS)
ALTER TABLE public.sube_profiller ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urunler ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gunluk_girdiler ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi verilerini yönetebilir
CREATE POLICY "kendi_profil" ON public.sube_profiller FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "kendi_urunler" ON public.urunler FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "kendi_girdiler" ON public.gunluk_girdiler FOR ALL USING (auth.uid() = user_id);

-- Admin tüm şubeleri görebilir
CREATE POLICY "admin_profil" ON public.sube_profiller FOR SELECT USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'brgrercan@gmail.com'
);
CREATE POLICY "admin_urunler" ON public.urunler FOR SELECT USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'brgrercan@gmail.com'
);
CREATE POLICY "admin_girdiler" ON public.gunluk_girdiler FOR SELECT USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'brgrercan@gmail.com'
);
