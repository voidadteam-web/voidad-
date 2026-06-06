-- Fix signup nonce via single RPC (called with service_role from API)
create or replace function public.prepare_signup(
  p_fingerprint_hash text,
  p_network_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_fingerprint_hash is null or p_network_hash is null then
    return jsonb_build_object('ok', false, 'error', 'DEVICE_INFO_REQUIRED');
  end if;

  if not public.check_free_tier_device_available(p_fingerprint_hash, p_network_hash) then
    return jsonb_build_object('ok', false, 'error', 'DEVICE_ALREADY_REGISTERED');
  end if;

  delete from public.signup_network_nonces where expires_at < now();

  insert into public.signup_network_nonces (fingerprint_hash, network_hash, expires_at, used_at)
  values (p_fingerprint_hash, p_network_hash, now() + interval '15 minutes', null)
  on conflict (fingerprint_hash, network_hash)
  do update set
    expires_at = excluded.expires_at,
    used_at = null;

  return jsonb_build_object(
    'ok', true,
    'network_hash', p_network_hash
  );
end;
$$;

-- Only service role may call (server-side signup API)
revoke all on function public.prepare_signup(text, text) from public;
grant execute on function public.prepare_signup(text, text) to service_role;
