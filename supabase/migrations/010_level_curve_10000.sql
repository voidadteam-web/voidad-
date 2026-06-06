-- Wider level gaps: level 1 at 10,000 VoidPoints (quadratic curve)

create or replace function public.voidpoints_to_level(p_voidpoints bigint)
returns integer
language sql
immutable
as $$
  select case
    when coalesce(p_voidpoints, 0) < 10000 then 0
    else least(57, floor(sqrt(p_voidpoints / 10000.0))::integer)
  end;
$$;

update public.profiles
set level = public.voidpoints_to_level(voidpoints_total)
where level <> public.voidpoints_to_level(voidpoints_total);

grant execute on function public.voidpoints_to_level(bigint) to service_role;
