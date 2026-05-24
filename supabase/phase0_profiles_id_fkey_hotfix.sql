-- ============================================================
-- Phase 0 Hotfix: 移除 profiles.id -> auth.users(id) 舊外鍵
-- ============================================================
-- 症狀：
-- LIFF 會員建檔出現：
-- insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
--
-- 原因：
-- 舊版 admin schema 將 public.profiles.id 綁定到 auth.users(id)，
-- 但 LINE/LIFF 會員不一定是 Supabase Auth user。
--
-- 執行位置：
-- Supabase Dashboard -> SQL Editor
-- ============================================================

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  alter column id set default gen_random_uuid();

create index if not exists profiles_line_user_id_idx
  on public.profiles (line_user_id);
