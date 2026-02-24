-- ============================================
-- ADD ADDRESS COLUMN TO PROFILES TABLE
-- ============================================
-- This script adds the missing 'address' column to the profiles table
-- Run this in Supabase SQL Editor

-- Add address column to profiles table if it doesn't exist
DO $$ 
BEGIN
    -- Check if the address column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'address'
    ) THEN
        -- Add the address column
        ALTER TABLE profiles ADD COLUMN address text;
        PRINT 'Address column added to profiles table';
    ELSE
        PRINT 'Address column already exists in profiles table';
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;