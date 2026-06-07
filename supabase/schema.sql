-- VoidAd Database Schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  country_code text,
  bio text,
  voidpoints_total bigint default 0 not null,
  voidpoints_donated bigint default 0 not null,
  level integer default 0 not null,
  ads_blocked bigint default 0 not null,
  is_public boolean default false not null,
  hide_leaderboard boolean default false not null,
  locale text default 'en' check (locale in ('en', 'de')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User protection settings
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  protection_enabled boolean default true not null,
  anti_adware boolean default true not null,
  anti_tracker boolean default true not null,
  anti_phishing boolean default true not null,
  false_positive_filter boolean default true not null,
  geo_block boolean default false not null,
  focus_mode_enabled boolean default false not null,
  notify_charity boolean default true not null,
  notify_level_up boolean default true not null,
  notify_protection boolean default true not null,
  enhanced_ad_blocking boolean default false not null,
  profile_mode text default 'default' not null
    check (profile_mode in ('default', 'child', 'strict')),
  block_tiktok boolean default false not null,
  block_social_media boolean default false not null,
  block_adult_content boolean default false not null,
  block_gambling boolean default true not null,
  safe_search boolean default false not null,
  blocked_keywords text[] default '{}' not null,
  data_compression boolean default false not null,
  zero_day_discovery boolean default false not null,
  share_voidpoints boolean default false not null,
  show_leaderboard_rank boolean default false not null,
  two_factor_enabled boolean default false not null,
  updated_at timestamptz default now() not null
);

-- VoidPoints activity log
create table if not exists public.voidpoints_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('ad_blocked', 'data_saved', 'donation', 'conversion', 'bonus')),
  points integer not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Charities for donations
create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_de text not null,
  description_en text,
  description_de text,
  logo_url text,
  is_verified boolean default true not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Donations
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  charity_id uuid not null references public.charities(id),
  points integer not null check (points > 0),
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 8),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Void Guardian')
  );

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.voidpoints_events enable row level security;
alter table public.charities enable row level security;
alter table public.donations enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (is_public = true or auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Settings policies
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- VoidPoints events
create policy "Users can view own events"
  on public.voidpoints_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on public.voidpoints_events for insert
  with check (auth.uid() = user_id);

-- Charities (public read)
create policy "Charities are publicly readable"
  on public.charities for select
  using (is_active = true);

-- Donations
create policy "Users can view own donations"
  on public.donations for select
  using (auth.uid() = user_id);

create policy "Users can create own donations"
  on public.donations for insert
  with check (auth.uid() = user_id);

-- Leaderboard view (public profiles only)
create or replace view public.leaderboard as
select
  id,
  username,
  display_name,
  avatar_url,
  country_code,
  voidpoints_total,
  voidpoints_donated,
  level,
  ads_blocked,
  rank() over (order by voidpoints_total desc) as global_rank
from public.profiles
where is_public = true and hide_leaderboard = false;

-- Seed charities
insert into public.charities (slug, name_en, name_de, description_en, description_de) values
  ('green-servers', 'Green Servers Alliance', 'Green Servers Alliance', 'Offset digital carbon footprints.', 'Digitale CO2-Fußabdrücke ausgleichen.'),
  ('plant-a-bit', 'Plant-A-Bit Initiative', 'Plant-A-Bit Initiative', 'Fund reforestation through tech savings.', 'Aufforstung durch Tech-Einsparungen finanzieren.'),
  ('digital-freedom', 'Digital Freedom Foundation', 'Digital Freedom Foundation', 'Support online privacy rights.', 'Online-Privatsphäre-Rechte unterstützen.')
on conflict (slug) do nothing;

-- See supabase/migrations/002_device_auth.sql for device/network anti-abuse & subscription plans
