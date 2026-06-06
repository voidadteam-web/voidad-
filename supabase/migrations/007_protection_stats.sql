-- Protection stats & live DNS activity feed

alter table public.profiles
  add column if not exists trackers_blocked bigint default 0 not null;

alter table public.profiles
  add column if not exists malicious_blocked bigint default 0 not null;

create table if not exists public.dns_activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  domain text not null,
  block_type text not null check (block_type in ('ad', 'tracker', 'phishing')),
  client_ip text,
  created_at timestamptz not null default now()
);

create index if not exists idx_dns_activity_user_created
  on public.dns_activity_log (user_id, created_at desc);

alter table public.dns_activity_log enable row level security;

drop policy if exists "Users can view own dns activity" on public.dns_activity_log;
create policy "Users can view own dns activity"
  on public.dns_activity_log for select
  using (auth.uid() = user_id);

-- Record batched DNS blocks from the VoidAd DNS server
create or replace function public.record_dns_blocks(p_user_id uuid, p_events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  v_type text;
  v_domain text;
  v_client text;
  v_ad_count bigint := 0;
  v_tracker_count bigint := 0;
  v_phishing_count bigint := 0;
  v_points bigint := 0;
begin
  if p_user_id is null or p_events is null then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    return jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND');
  end if;

  for event in select * from jsonb_array_elements(p_events)
  loop
    v_type := coalesce(event->>'type', 'ad');
    v_domain := coalesce(event->>'domain', '');
    v_client := nullif(event->>'client_ip', '');

    if v_domain = '' then
      continue;
    end if;

    if v_type not in ('ad', 'tracker', 'phishing') then
      v_type := 'ad';
    end if;

    insert into public.dns_activity_log (user_id, domain, block_type, client_ip)
    values (p_user_id, v_domain, v_type, v_client);

    if v_type = 'ad' then
      v_ad_count := v_ad_count + 1;
      v_points := v_points + 1;
    elsif v_type = 'tracker' then
      v_tracker_count := v_tracker_count + 1;
      v_points := v_points + 1;
    else
      v_phishing_count := v_phishing_count + 1;
      v_points := v_points + 2;
    end if;
  end loop;

  update public.profiles
  set
    ads_blocked = ads_blocked + v_ad_count,
    trackers_blocked = trackers_blocked + v_tracker_count,
    malicious_blocked = malicious_blocked + v_phishing_count,
    voidpoints_total = voidpoints_total + v_points,
    updated_at = now()
  where id = p_user_id;

  return jsonb_build_object(
    'ok', true,
    'ads', v_ad_count,
    'trackers', v_tracker_count,
    'phishing', v_phishing_count,
    'points', v_points
  );
end;
$$;

grant execute on function public.record_dns_blocks(uuid, jsonb) to service_role;
