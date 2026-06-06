-- VoidAd DNS profiles: per-user home network control via router DNS

create table if not exists public.dns_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  home_ips text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dns_profiles_home_ips
  on public.dns_profiles using gin (home_ips);

create index if not exists idx_dns_profiles_token
  on public.dns_profiles (token);

-- Auto-create DNS profile for new users
create or replace function public.create_dns_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.dns_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_create_dns on public.profiles;
create trigger on_profile_create_dns
  after insert on public.profiles
  for each row execute function public.create_dns_profile_for_user();

-- Backfill existing profiles
insert into public.dns_profiles (user_id)
select id from public.profiles
where id not in (select user_id from public.dns_profiles)
on conflict (user_id) do nothing;

-- Register the caller's public IP as a home network (max 3 IPs per account)
create or replace function public.register_dns_home_ip(p_ip text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_ips text[];
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_ip is null or p_ip = '' or p_ip = 'unknown' then
    return jsonb_build_object('ok', false, 'error', 'INVALID_IP');
  end if;

  select home_ips into v_ips
  from public.dns_profiles
  where user_id = v_user_id;

  if not found then
    insert into public.dns_profiles (user_id, home_ips)
    values (v_user_id, array[p_ip])
    returning home_ips into v_ips;
    return jsonb_build_object('ok', true, 'home_ips', v_ips);
  end if;

  if p_ip = any(v_ips) then
    return jsonb_build_object('ok', true, 'home_ips', v_ips, 'already_registered', true);
  end if;

  if coalesce(array_length(v_ips, 1), 0) >= 3 then
    return jsonb_build_object('ok', false, 'error', 'MAX_NETWORKS');
  end if;

  update public.dns_profiles
  set home_ips = array_append(v_ips, p_ip),
      updated_at = now()
  where user_id = v_user_id
  returning home_ips into v_ips;

  return jsonb_build_object('ok', true, 'home_ips', v_ips);
end;
$$;

grant execute on function public.register_dns_home_ip(text) to authenticated;

alter table public.dns_profiles enable row level security;

drop policy if exists "Users can view own dns profile" on public.dns_profiles;
create policy "Users can view own dns profile"
  on public.dns_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own dns profile" on public.dns_profiles;
create policy "Users can update own dns profile"
  on public.dns_profiles for update
  using (auth.uid() = user_id);

create trigger dns_profiles_updated_at
  before update on public.dns_profiles
  for each row execute function public.set_updated_at();
