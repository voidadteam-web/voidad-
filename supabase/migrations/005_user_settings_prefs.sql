-- Extra preference columns for settings page toggles
alter table public.user_settings
  add column if not exists enhanced_ad_blocking boolean default false not null,
  add column if not exists data_compression boolean default false not null,
  add column if not exists zero_day_discovery boolean default false not null,
  add column if not exists share_voidpoints boolean default false not null,
  add column if not exists show_leaderboard_rank boolean default false not null,
  add column if not exists two_factor_enabled boolean default false not null;
