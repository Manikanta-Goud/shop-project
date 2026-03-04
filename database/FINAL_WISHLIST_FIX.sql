-- ================================================================
-- COMPLETE WISHLIST FIX FOR CLERK AUTHENTICATION
-- ================================================================
-- This script completely resets your database for Clerk auth
-- Run this ONCE in Supabase SQL Editor
-- ================================================================

-- STEP 1: FORCE REMOVE ALL RLS POLICIES FROM ALL TABLES
-- ================================================================
DO $$ 
DECLARE 
    pol record;
BEGIN 
    -- Drop all policies from user tables
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE tablename IN ('profiles', 'wishlist', 'cart', 'orders', 'products', 'offers')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
        RAISE NOTICE 'Dropped policy: % on %', pol.policyname, pol.tablename;
    END LOOP;
END $$;

-- STEP 2: DISABLE RLS ON ALL TABLES
-- ================================================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;

-- STEP 3: DROP ALL AUTH.USERS FOREIGN KEY CONSTRAINTS
-- ================================================================
-- These cause errors because Clerk doesn't use auth.users table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_user_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- STEP 4: ENSURE ALL USER_ID COLUMNS ARE TEXT TYPE
-- ================================================================
-- Clerk uses text IDs like "user_2abc123", not UUIDs
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE wishlist ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE cart ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN user_id TYPE TEXT;

-- STEP 5: RECREATE FOREIGN KEY CONSTRAINTS (products only)
-- ================================================================
-- We keep product references but remove auth.users references
ALTER TABLE wishlist 
    DROP CONSTRAINT IF EXISTS wishlist_product_id_fkey,
    ADD CONSTRAINT wishlist_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE cart 
    DROP CONSTRAINT IF EXISTS cart_product_id_fkey,
    ADD CONSTRAINT cart_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE orders 
    DROP CONSTRAINT IF EXISTS orders_product_id_fkey,
    ADD CONSTRAINT orders_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- STEP 6: GRANT ANON ACCESS (Required for Clerk users)
-- ================================================================
GRANT ALL ON profiles TO anon;
GRANT ALL ON wishlist TO anon;
GRANT ALL ON cart TO anon;
GRANT ALL ON orders TO anon;
GRANT ALL ON products TO anon;
GRANT ALL ON offers TO anon;

-- STEP 7: VERIFICATION QUERIES
-- ================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ DATABASE RESET COMPLETE FOR CLERK';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✓ All RLS policies removed';
    RAISE NOTICE '✓ RLS disabled on all tables';
    RAISE NOTICE '✓ Auth constraints removed';
    RAISE NOTICE '✓ User IDs converted to TEXT';
    RAISE NOTICE '✓ Product foreign keys restored';
    RAISE NOTICE '✓ Anon permissions granted';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Your wishlist/like feature should work now!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Refresh your app and test the heart icon';
    RAISE NOTICE '========================================';
END $$;

-- Display current schema for verification
SELECT 
    table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('wishlist', 'cart', 'profiles') 
    AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;
