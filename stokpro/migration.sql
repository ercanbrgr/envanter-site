-- =============================================
-- StokPro - SaaS Envanter Sistemi
-- Supabase SQL Migration v1.0
-- =============================================

-- 1. WORKSPACES (İşletmeler)
CREATE TABLE public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  logo_url TEXT,
  city TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PROFILES (Kullanıcı profilleri)
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('super_admin','owner','admin','user')),
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BRANCHES (Şubeler)
CREATE TABLE public.branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CATEGORIES (Ürün kategorileri)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#e85d04',
  order_idx INTEGER DEFAULT 0
);

-- 5. PRODUCTS (Ürünler)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit TEXT DEFAULT 'Adet',
  min_stock NUMERIC,
  order_idx INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BRANCH_USERS (Şube-Kullanıcı eşleşmesi)
CREATE TABLE public.branch_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(branch_id, user_id)
);

-- 7. DAILY_ENTRIES (Günlük girdiler)
CREATE TABLE public.daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  day_num INTEGER,
  opening NUMERIC,
  added NUMERIC DEFAULT 0,
  closing NUMERIC,
  waste NUMERIC DEFAULT 0,
  note TEXT,
  locked BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(branch_id, product_id, entry_date)
);

-- 8. EXPIRY_TRACKING (SKT takip)
CREATE TABLE public.expiry_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  quantity TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. AUDIT_LOGS (İşlem logları)
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expiry_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: Kullanıcının workspace_id'sini döndürür
CREATE OR REPLACE FUNCTION public.my_workspace_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT workspace_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Helper: Kullanıcının rolü
CREATE OR REPLACE FUNCTION public.my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- WORKSPACES policies
CREATE POLICY "Kendi workspace'ini gor" ON public.workspaces
  FOR SELECT USING (id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "Owner workspace guncelle" ON public.workspaces
  FOR UPDATE USING (owner_id = auth.uid() OR public.my_role() = 'super_admin');

CREATE POLICY "Yeni workspace olustur" ON public.workspaces
  FOR INSERT WITH CHECK (true);

-- PROFILES policies
CREATE POLICY "Kendi profilini gor" ON public.profiles
  FOR SELECT USING (
    user_id = auth.uid()
    OR workspace_id = public.my_workspace_id()
    OR public.my_role() = 'super_admin'
  );

CREATE POLICY "Profil olustur" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Profil guncelle" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.my_role() IN ('super_admin','owner','admin'));

-- BRANCHES policies
CREATE POLICY "Workspace subelerini gor" ON public.branches
  FOR SELECT USING (workspace_id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "Admin sube ekle" ON public.branches
  FOR INSERT WITH CHECK (workspace_id = public.my_workspace_id() AND public.my_role() IN ('super_admin','owner','admin'));

CREATE POLICY "Admin sube guncelle" ON public.branches
  FOR UPDATE USING (workspace_id = public.my_workspace_id() AND public.my_role() IN ('super_admin','owner','admin'));

-- CATEGORIES policies
CREATE POLICY "Workspace kategorilerini gor" ON public.categories
  FOR SELECT USING (workspace_id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "Admin kategori yonet" ON public.categories
  FOR ALL USING (workspace_id = public.my_workspace_id() AND public.my_role() IN ('super_admin','owner','admin'));

-- PRODUCTS policies
CREATE POLICY "Workspace urunlerini gor" ON public.products
  FOR SELECT USING (workspace_id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "Admin urun yonet" ON public.products
  FOR ALL USING (workspace_id = public.my_workspace_id() AND public.my_role() IN ('super_admin','owner','admin'));

-- BRANCH_USERS policies
CREATE POLICY "Branch users gor" ON public.branch_users
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.my_role() IN ('super_admin','owner','admin')
  );

CREATE POLICY "Admin branch user yonet" ON public.branch_users
  FOR ALL USING (public.my_role() IN ('super_admin','owner','admin'));

-- DAILY_ENTRIES policies
CREATE POLICY "Kendi subesi girdi gor" ON public.daily_entries
  FOR SELECT USING (
    branch_id IN (
      SELECT b.id FROM public.branches b
      WHERE b.workspace_id = public.my_workspace_id()
    )
    OR public.my_role() = 'super_admin'
  );

CREATE POLICY "Girdi ekle" ON public.daily_entries
  FOR INSERT WITH CHECK (
    branch_id IN (
      SELECT b.id FROM public.branches b
      WHERE b.workspace_id = public.my_workspace_id()
    )
  );

CREATE POLICY "Girdi guncelle" ON public.daily_entries
  FOR UPDATE USING (
    locked = false
    AND branch_id IN (
      SELECT b.id FROM public.branches b
      WHERE b.workspace_id = public.my_workspace_id()
    )
  );

-- EXPIRY_TRACKING policies
CREATE POLICY "SKT gor" ON public.expiry_tracking
  FOR SELECT USING (workspace_id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "SKT yonet" ON public.expiry_tracking
  FOR ALL USING (workspace_id = public.my_workspace_id());

-- AUDIT_LOGS policies
CREATE POLICY "Audit log gor" ON public.audit_logs
  FOR SELECT USING (workspace_id = public.my_workspace_id() OR public.my_role() = 'super_admin');

CREATE POLICY "Audit log ekle" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- =============================================
-- SUPER ADMIN ATAMASI
-- Bu SQL'i çalıştırdıktan sonra kendi email'iniz
-- için profiles tablosunda role='super_admin' ayarlayın:
-- UPDATE public.profiles SET role='super_admin' WHERE email='SIZIN_EMAIL@ornek.com';
-- =============================================
