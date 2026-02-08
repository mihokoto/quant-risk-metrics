-- =========================================================
-- MASTER RESTORATION SCRIPT: QuantRiskMetrics
-- Rebuilds all tables, policies, and institutional data
-- =========================================================

-- --- 1. CLEANUP (Optional: Only if you want a fresh start) ---
-- DROP TABLE IF EXISTS public.user_reports CASCADE;
-- DROP TABLE IF EXISTS public.firms CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- --- 2. CREATE FIRMS TABLE ---
CREATE TABLE IF NOT EXISTS public.firms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    rules JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.firms;
CREATE POLICY "Allow public read access" ON public.firms
    FOR SELECT USING (is_active = true);

-- --- 3. CREATE USER REPORTS TABLE ---
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    simulation_config JSONB NOT NULL,
    simulation_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own reports" ON public.user_reports;
CREATE POLICY "Users can see own reports" ON public.user_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reports" ON public.user_reports;
CREATE POLICY "Users can insert own reports" ON public.user_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --- 4. CREATE SAAS PROFILES TABLE ---
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'BASIC' CHECK (subscription_tier IN ('BASIC', 'PRO')),
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- --- 5. AUTH TRIGGERS ---
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, subscription_tier)
    VALUES (NEW.id, NEW.email, 'BASIC');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- --- 6. SEED DATA (INSTITUTIONAL GRADE) ---
DELETE FROM public.firms;

-- Apex 50k
INSERT INTO public.firms (name, slug, description, rules) VALUES (
  'Apex 50k (Intraday)', 
  'apex_50k', 
  'Strict trailing threshold with 30% consistency rule.',
  '{
    "drawdownType": "TRAILING_UNREALIZED",
    "breachType": "HARD_BREACH",
    "profitTarget": 3000,
    "drawdownLimit": 2500,
    "dailyLossLimit": 0,
    "enablePALock": true,
    "tradesPerDay": 4,
    "consistencyThreshold": 0.3,
    "minTradingDays": 7
  }'
);

-- FTMO 100k
INSERT INTO public.firms (name, slug, description, rules) VALUES (
  'FTMO 100k (Static)', 
  'ftmo_100k', 
  'Institutional static max loss with strict 10-day min trading rule.',
  '{
    "drawdownType": "STATIC_FIXED",
    "breachType": "HARD_BREACH",
    "profitTarget": 10000,
    "drawdownLimit": 10000,
    "dailyLossLimit": 5000,
    "tradesPerDay": 4,
    "consistencyThreshold": 1.0,
    "minTradingDays": 10
  }'
);

-- Topstep 50k
INSERT INTO public.firms (name, slug, description, rules) VALUES (
  'Topstep 50k (EOD)', 
  'topstep_50k', 
  'EOD Drawdown calculation with 50% consistency compliance.',
  '{
    "drawdownType": "TRAILING_EOD",
    "breachType": "HARD_BREACH",
    "profitTarget": 3000,
    "drawdownLimit": 2000,
    "dailyLossLimit": 1000,
    "enableBalanceLock": true,
    "tradesPerDay": 4,
    "consistencyThreshold": 0.5,
    "minTradingDays": 5
  }'
);

-- Custom Standard
INSERT INTO public.firms (name, slug, description, rules) VALUES (
  'Custom Standard Model', 
  'custom_standard', 
  'Baseline retail funding challenge model.',
  '{
    "drawdownType": "STATIC_FIXED",
    "breachType": "HARD_BREACH",
    "profitTarget": 2000,
    "drawdownLimit": 1000,
    "dailyLossLimit": 0,
    "tradesPerDay": 4,
    "consistencyThreshold": 0.4,
    "minTradingDays": 5
  }'
);

CREATE INDEX IF NOT EXISTS profiles_subscription_tier_idx ON public.profiles(subscription_tier);
