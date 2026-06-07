-- Family / child profile filters: TikTok, social, adult, gambling, keywords

alter table public.user_settings
  add column if not exists profile_mode text default 'default' not null
    check (profile_mode in ('default', 'child', 'strict')),
  add column if not exists block_tiktok boolean default false not null,
  add column if not exists block_social_media boolean default false not null,
  add column if not exists block_adult_content boolean default false not null,
  add column if not exists block_gambling boolean default true not null,
  add column if not exists safe_search boolean default false not null,
  add column if not exists blocked_keywords text[] default '{}' not null;

-- Extend activity log block types for family filters
alter table public.dns_activity_log
  drop constraint if exists dns_activity_log_block_type_check;

alter table public.dns_activity_log
  add constraint dns_activity_log_block_type_check
  check (block_type in ('ad', 'tracker', 'phishing', 'social', 'adult', 'gambling', 'keyword'));

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

    if v_type not in ('ad', 'tracker', 'phishing', 'social', 'adult', 'gambling', 'keyword') then
      v_type := 'ad';
    end if;

    insert into public.dns_activity_log (user_id, domain, block_type, client_ip)
    values (p_user_id, v_domain, v_type, v_client);

    if v_type = 'tracker' then
      v_tracker_count := v_tracker_count + 1;
      v_points := v_points + 1;
    elsif v_type = 'phishing' then
      v_phishing_count := v_phishing_count + 1;
      v_points := v_points + 2;
    else
      v_ad_count := v_ad_count + 1;
      v_points := v_points + 1;
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
