-- =============================================
-- MindSphere User Profile Migration
-- =============================================
-- This migration creates tables for Google user basics and minimal profile data
-- Run this in Supabase SQL Editor

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

-- Unique email constraint
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

-- =============================================
-- Migration Complete
-- =============================================
-- Tables created:
-- ✅ app_users - stores Google user basics
-- ✅ basic_profiles - stores editable profile fields
-- 
-- Next steps:
-- 1. Test with Google OAuth
-- 2. Implement /api/v1/me/sync endpoint
-- 3. Implement /api/v1/profile/basic endpoints
