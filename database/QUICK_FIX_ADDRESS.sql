-- ============================================
-- QUICK FIX: ADD MISSING ADDRESS COLUMN
-- ============================================
-- Run this in your Supabase SQL Editor to fix the missing address column

-- Simple fix: Add address column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;

-- Verify it was added
\d profiles;