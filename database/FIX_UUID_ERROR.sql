-- COMPLETE FIX FOR UUID ERROR WITH CLERK IDs
-- This fixes the "invalid input syntax for type uuid" error
-- Run this in Supabase SQL Editor

-- Step 1: Drop all foreign keys and policies that depend on user_id
ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_user_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Step 2: Clear existing data (optional - remove this if you want to keep data)
-- TRUNCATE TABLE wishlist, cart, orders;

-- Step 3: Change all user_id columns to TEXT to match Clerk format
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE wishlist ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE cart ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN user_id TYPE TEXT;

-- Step 4: Ensure all required columns exist in profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Recreate policies for Clerk authentication
CREATE POLICY "Users can view own profile" ON profiles
    FOR ALL USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can manage own wishlist" ON wishlist
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can manage own cart" ON cart
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view own orders" ON orders
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Step 6: Verify the fix worked
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'wishlist', 'cart', 'orders') 
  AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- This should now show all user_id columns as 'text' type