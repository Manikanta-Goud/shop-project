-- ============================================
-- SUPABASE SETUP FOR ADMIN PRODUCT MANAGEMENT
-- Run this in your Supabase SQL Editor
-- ============================================

-- 0. FIX MISSING COLUMNS (if you created table before)
-- Add the 'type' column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'type'
    ) THEN
        ALTER TABLE products ADD COLUMN type text NOT NULL DEFAULT 'Saree';
    END IF;
END $$;

-- Also ensure other columns exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'stock_count'
    ) THEN
        ALTER TABLE products ADD COLUMN stock_count integer DEFAULT 10;
    END IF;
    
    -- Add created_at to profiles if missing (for sorting in admin)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- 1. ENABLE REALTIME FOR PRODUCTS TABLE
-- This allows the frontend to receive instant updates when products change
DO $$ 
BEGIN
    -- Try to add products table to realtime publication
    -- Ignore error if already added
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication, skip
    NULL;
END $$;

-- 2. ADD ADMIN POLICIES FOR PRODUCT MANAGEMENT
-- These policies allow authenticated users to add, update, and delete products
-- Note: In production, you should restrict this to admin users only

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow product creation" ON products;
DROP POLICY IF EXISTS "Allow product updates" ON products;
DROP POLICY IF EXISTS "Allow product deletion" ON products;

-- Allow anyone to insert products (you can restrict this to admin role later)
CREATE POLICY "Allow product creation" 
ON products FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update products (you can restrict this to admin role later)
CREATE POLICY "Allow product updates" 
ON products FOR UPDATE 
USING (true);

-- Allow anyone to delete products (you can restrict this to admin role later)
CREATE POLICY "Allow product deletion" 
ON products FOR DELETE 
USING (true);

-- ============================================
-- OPTIONAL: ADMIN ROLE-BASED POLICIES
-- ============================================
-- If you want to restrict product management to admin users only,
-- uncomment and run the following after setting up user roles:

-- First, create a custom claim for admin users in your auth.users table
-- You can do this through Supabase Auth hooks or manually

-- Then, replace the above policies with these:
-- DROP POLICY "Allow product creation" ON products;
-- DROP POLICY "Allow product updates" ON products;
-- DROP POLICY "Allow product deletion" ON products;

-- CREATE POLICY "Admin can insert products" 
-- ON products FOR INSERT 
-- WITH CHECK (
--   auth.jwt() ->> 'role' = 'admin' OR
--   auth.jwt() ->> 'email' = 'admin@gmail.com'
-- );

-- CREATE POLICY "Admin can update products" 
-- ON products FOR UPDATE 
-- USING (
--   auth.jwt() ->> 'role' = 'admin' OR
--   auth.jwt() ->> 'email' = 'admin@gmail.com'
-- );

-- CREATE POLICY "Admin can delete products" 
-- ON products FOR DELETE 
-- USING (
--   auth.jwt() ->> 'role' = 'admin' OR
--   auth.jwt() ->> 'email' = 'admin@gmail.com'
-- );

-- ============================================
-- VERIFY SETUP
-- ============================================
-- After running this, verify by:
-- 1. Check if realtime is enabled: SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
-- 2. Test adding a product from admin portal
-- 3. Check if frontend updates automatically
