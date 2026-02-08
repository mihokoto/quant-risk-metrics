-- Create Firms Table
create table public.firms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  is_active boolean default true,
  rules jsonb not null, -- The Zod schema validates this structure
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.firms enable row level security;

-- Policy: Everyone can read active firms
create policy "Allow public read access" on public.firms
  for select using (is_active = true);


-- Create User Reports Table
create table public.user_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  simulation_config jsonb not null,
  simulation_result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_reports enable row level security;

-- Policy: Users can only see their own reports
create policy "Users can see own reports" on public.user_reports
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own reports
create policy "Users can insert own reports" on public.user_reports
  for insert with check (auth.uid() = user_id);

-- --- SEED DATA ---

-- Apex-style (50k)
insert into public.firms (name, slug, description, rules) values (
  'Apex 50k (Intraday)', 
  'apex_50k', 
  'Trailing threshold based on unrealized high water mark.',
  '{
    "drawdownType": "TRAILING_UNREALIZED",
    "breachType": "HARD_BREACH",
    "profitTarget": 3000,
    "drawdownLimit": 2500,
    "dailyLossLimit": 0,
    "enablePALock": true,
    "tradesPerDay": 10
  }'
);

-- Topstep-style (50k)
insert into public.firms (name, slug, description, rules) values (
  'Topstep 50k (EOD)', 
  'topstep_50k', 
  'Drawdown calculation updates only at end of day.',
  '{
    "drawdownType": "TRAILING_EOD",
    "breachType": "HARD_BREACH",
    "profitTarget": 3000,
    "drawdownLimit": 2000,
    "dailyLossLimit": 1000,
    "enableBalanceLock": true,
    "tradesPerDay": 5
  }'
);

-- FTMO-style (100k)
insert into public.firms (name, slug, description, rules) values (
  'FTMO 100k (Static)', 
  'ftmo_100k', 
  'Static max loss with strict daily limit.',
  '{
    "drawdownType": "STATIC_FIXED",
    "breachType": "HARD_BREACH",
    "profitTarget": 10000,
    "drawdownLimit": 10000,
    "dailyLossLimit": 5000,
    "tradesPerDay": 5
  }'
);
