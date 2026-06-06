-- Register localhost IPv4 + IPv6 together for local development

create or replace function public.register_dns_home_ip(p_ip text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_ips text[];
  v_to_add text[];
  v_ip text;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_ip is null or p_ip = '' or p_ip = 'unknown' then
    return jsonb_build_object('ok', false, 'error', 'INVALID_IP');
  end if;

  v_to_add := array[p_ip];
  if p_ip in ('127.0.0.1', '::1') then
    v_to_add := array['127.0.0.1', '::1'];
  end if;

  select home_ips into v_ips
  from public.dns_profiles
  where user_id = v_user_id;

  if not found then
    insert into public.dns_profiles (user_id, home_ips)
    values (v_user_id, v_to_add)
    returning home_ips into v_ips;
    return jsonb_build_object('ok', true, 'home_ips', v_ips);
  end if;

  foreach v_ip in array v_to_add
  loop
    if not (v_ip = any(v_ips)) then
      if coalesce(array_length(v_ips, 1), 0) >= 5 then
        return jsonb_build_object('ok', false, 'error', 'MAX_NETWORKS');
      end if;
      v_ips := array_append(v_ips, v_ip);
    end if;
  end loop;

  update public.dns_profiles
  set home_ips = v_ips,
      updated_at = now()
  where user_id = v_user_id;

  return jsonb_build_object('ok', true, 'home_ips', v_ips);
end;
$$;
