-- Test script to verify migration syntax
-- This can be run in Supabase SQL Editor to test the migration

-- Users (app-level mirror of auth users)
create table if not exists app_users (
  id uuid primary key,                 -- equals auth.user.id (UUID)
  email text not null,
  display_name text,
  avatar_url text,
  provider text default 'google',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists app_users_email_key on app_users(email);

-- Basic profile (can coexist with your richer profile tables)
create table if not exists basic_profiles (
  user_id uuid primary key references app_users(id) on delete cascade,
  given_name text,
  family_name text,
  locale text,
  timezone text,
  updated_at timestamptz not null default now()
);

-- Verify tables were created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('app_users', 'basic_profiles')
ORDER BY table_name, ordinal_position;

-- Check that tables are empty
SELECT 'app_users' as table_name, count(*) as row_count FROM app_users
UNION ALL
SELECT 'basic_profiles' as table_name, count(*) as row_count FROM basic_profiles;
