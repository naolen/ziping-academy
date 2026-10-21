-- 子平学堂 · 同步表
-- 在 Supabase 的 SQL Editor 里整段执行即可。
--
-- 设计要点：同步码即钥匙。行级权限要求请求头 x-sync-code 与该行 code 一致，
-- 因此即使拿着公开的 anon key，没有码也读不到、写不了任何一行。

create table if not exists public.sync_state (
  code text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- 每次写入自动刷新服务端时间，避免依赖设备时钟
create or replace function public.touch_sync_state()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sync_state_touch on public.sync_state;
create trigger sync_state_touch
before insert or update on public.sync_state
for each row execute function public.touch_sync_state();

alter table public.sync_state enable row level security;

drop policy if exists sync_state_by_code on public.sync_state;
create policy sync_state_by_code
on public.sync_state
for all
to anon, authenticated
using (
  code = (nullif(current_setting('request.headers', true), '')::json ->> 'x-sync-code')
)
with check (
  code = (nullif(current_setting('request.headers', true), '')::json ->> 'x-sync-code')
);

grant select, insert, update on public.sync_state to anon, authenticated;
