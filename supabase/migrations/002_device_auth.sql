-- VoidAd Auth & Device Enforcement (run after schema.sql)
-- Prevents multiple Trial/Free accounts per device or home network (router IP)

alter table public.profiles
  add column if not exists subscription_plan text default 'trial' not null
    check (subscription_plan in ('trial', 'free', 'pro', 'ultimate'));

alter table public.profiles
  add column if not exists trial_ends_at timestamptz default (now() + interval '24 hours');

create table if not exists public.device_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  fingerprint_hash text not null,
  network_hash text not null,
  created_at timestamptz default now() not null,
  last_seen_at timestamptz default now() not null
);

create index if not exists idx_device_registrations_fingerprint
  on public.device_registrations(fingerprint_hash);

create index if not exists idx_device_registrations_network
  on public.device_registrations(network_hash);

-- Short-lived nonce issued by server (binds fingerprint + network from same IP)
create table if not exists public.signup_network_nonces (
  id uuid primary key default gen_random_uuid(),
  fingerprint_hash text not null,
  network_hash text not null,
  expires_at timestamptz not null default (now() + interval '15 minutes'),
  used_at timestamptz,
  unique (fingerprint_hash, network_hash)
);

create index if not exists idx_signup_nonces_expires
  on public.signup_network_nonces(expires_at);

alter table public.signup_network_nonces enable row level security;

create or replace function public.check_free_tier_device_available(
  p_fingerprint_hash text,
  p_network_hash text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_fingerprint_hash is null or p_network_hash is null then
    return false;
  end if;

  return not exists (
    select 1
    from public.device_registrations dr
    inner join public.profiles p on p.id = dr.user_id
    where p.subscription_plan in ('trial', 'free')
      and (
        dr.fingerprint_hash = p_fingerprint_hash
        or dr.network_hash = p_network_hash
      )
  );
end;
$$;

grant execute on function public.check_free_tier_device_available(text, text) to anon, authenticated;

create or replace function public.verify_user_device(
  p_fingerprint_hash text,
  p_network_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan text;
  v_reg public.device_registrations%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'reason', 'NOT_AUTHENTICATED');
  end if;

  select subscription_plan into v_plan
  from public.profiles
  where id = v_user_id;

  if v_plan is null then
    return jsonb_build_object('ok', false, 'reason', 'NO_PROFILE');
  end if;

  if v_plan not in ('trial', 'free') then
    return jsonb_build_object('ok', true, 'reason', 'PAID_PLAN');
  end if;

  select * into v_reg
  from public.device_registrations
  where user_id = v_user_id;

  if not found then
    if not public.check_free_tier_device_available(p_fingerprint_hash, p_network_hash) then
      return jsonb_build_object('ok', false, 'reason', 'DEVICE_ALREADY_REGISTERED');
    end if;

    insert into public.device_registrations (user_id, fingerprint_hash, network_hash)
    values (v_user_id, p_fingerprint_hash, p_network_hash);

    return jsonb_build_object('ok', true, 'reason', 'REGISTERED');
  end if;

  if v_reg.fingerprint_hash = p_fingerprint_hash
     or v_reg.network_hash = p_network_hash then
    update public.device_registrations
    set last_seen_at = now()
    where user_id = v_user_id;

    return jsonb_build_object('ok', true, 'reason', 'MATCH');
  end if;

  return jsonb_build_object('ok', false, 'reason', 'DEVICE_MISMATCH');
end;
$$;

grant execute on function public.verify_user_device(text, text) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fp text := new.raw_user_meta_data ->> 'device_fingerprint';
  v_nh text := new.raw_user_meta_data ->> 'network_hash';
  v_plan text := coalesce(new.raw_user_meta_data ->> 'subscription_plan', 'trial');
  v_display text := coalesce(new.raw_user_meta_data ->> 'display_name', 'Void Guardian');
  v_locale text := coalesce(new.raw_user_meta_data ->> 'locale', 'en');
begin
  if v_plan in ('trial', 'free') then
    if v_fp is null or v_nh is null then
      raise exception 'DEVICE_INFO_REQUIRED';
    end if;

    if not exists (
      select 1 from public.signup_network_nonces
      where fingerprint_hash = v_fp
        and network_hash = v_nh
        and used_at is null
        and expires_at > now()
    ) then
      raise exception 'INVALID_SIGNUP_NONCE';
    end if;

    if not public.check_free_tier_device_available(v_fp, v_nh) then
      raise exception 'DEVICE_ALREADY_REGISTERED';
    end if;
  end if;

  insert into public.profiles (
    id,
    username,
    display_name,
    subscription_plan,
    trial_ends_at,
    locale
  )
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 8),
    v_display,
    v_plan,
    case when v_plan = 'trial' then now() + interval '24 hours' else null end,
    v_locale
  );

  insert into public.user_settings (user_id)
  values (new.id);

  if v_fp is not null and v_nh is not null then
    insert into public.device_registrations (user_id, fingerprint_hash, network_hash)
    values (new.id, v_fp, v_nh);

    update public.signup_network_nonces
    set used_at = now()
    where fingerprint_hash = v_fp
      and network_hash = v_nh
      and used_at is null;
  end if;

  return new;
end;
$$;

alter table public.device_registrations enable row level security;

drop policy if exists "Users can view own device registration" on public.device_registrations;
create policy "Users can view own device registration"
  on public.device_registrations for select
  using (auth.uid() = user_id);
