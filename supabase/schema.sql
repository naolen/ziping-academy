-- 子平学堂 · 同步表与接口
-- 在 Supabase 的 SQL Editor 里整段执行即可。
--
-- 设计要点：
-- 1. 表本身对 anon 完全关闭（不建任何 RLS 策略 + 收回表权限），无法列举、无法直接读写。
-- 2. 读写只通过两个 security definer 函数，必须传入正确的同步码才能命中对应行。
-- 3. 同步码走请求体而不是自定义请求头，避免跨域预检被拦。

create table if not exists public.sync_state (
  code text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sync_state enable row level security;
revoke all on public.sync_state from anon, authenticated;

create or replace function public.get_sync_state(p_code text)
returns table (payload jsonb, updated_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select s.payload, s.updated_at from public.sync_state s where s.code = p_code;
$$;

create or replace function public.put_sync_state(p_code text, p_payload jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  t timestamptz;
begin
  insert into public.sync_state as s (code, payload)
  values (p_code, p_payload)
  on conflict (code) do update
    set payload = excluded.payload,
        updated_at = now()
  returning s.updated_at into t;
  return t;
end;
$$;

grant execute on function public.get_sync_state(text) to anon, authenticated;
grant execute on function public.put_sync_state(text, jsonb) to anon, authenticated;
