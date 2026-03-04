-- ============================================
-- SRI DURGA SAREES - COMPLETE DATABASE SETUP
-- ============================================
-- UPDATED FOR CLERK AUTHENTICATION + ADDRESS COLUMN FIX
-- 
-- This is the COMPLETE all-in-one setup script.
-- Copy this ENTIRE file and run in Supabase SQL Editor.
-- This will set up everything from scratch including the missing address column.
--
-- FEATURES:
-- ✅ Clerk authentication support (TEXT user IDs)
-- ✅ All required columns including 'address'
-- ✅ Proper triggers and functions
-- ✅ Sample data for testing
-- ✅ Complete schema setup
-- ============================================

-- STEP 1: DROP EXISTING OBJECTS TO START FRESH
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing tables if they exist (optional - remove these lines if you want to keep existing data)
-- DROP TABLE IF EXISTS cart CASCADE;
-- DROP TABLE IF EXISTS wishlist CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS offers CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 2: CREATE UPDATED TABLES
-- ============================================

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    original_price TEXT,
    image TEXT NOT NULL,
    images TEXT[],
    description TEXT,
    tag TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Saree',
    stock_count INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (Clerk Compatible + Address Column)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,                -- Clerk uses TEXT IDs
    full_name TEXT,                     -- User's full name
    email TEXT,                         -- Email address
    phone TEXT,                         -- Phone number
    address TEXT,                       -- 🔥 ADDRESS COLUMN INCLUDED
    loyalty_points INTEGER DEFAULT 0,   -- Loyalty program points
    avatar_url TEXT,                    -- Profile picture URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist Table (Clerk Compatible)
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,              -- References profiles.id (Clerk)
    product_id INTEGER NOT NULL,        -- References products.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart Table (Clerk Compatible)
CREATE TABLE IF NOT EXISTS cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,              -- References profiles.id (Clerk)
    product_id INTEGER NOT NULL,        -- References products.id
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table (Clerk Compatible)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,              -- References profiles.id (Clerk)
    total_amount TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    tracking_id TEXT,
    items JSONB NOT NULL,
    shipping_address TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers Table
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    price TEXT NOT NULL,
    original_price TEXT,
    discount_percentage INTEGER,
    category TEXT NOT NULL,
    tag TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: CREATE TRIGGER FUNCTIONS
-- ============================================

-- Function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 4: CREATE TRIGGERS
-- ============================================

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cart table
DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;
CREATE TRIGGER update_cart_updated_at
    BEFORE UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for offers table
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
CREATE TRIGGER update_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);

-- STEP 6: INSERT SAMPLE PRODUCTS DATA
-- ============================================

INSERT INTO products (name, price, original_price, image, category, type, description, tag) VALUES
-- Kanchipuram Sarees
('Royal Kanchipuram Silk Saree', '₹15,999', '₹19,999', '/api/placeholder/400/600', 'Sarees', 'Kanchipuram', 'Exquisite handwoven Kanchipuram silk saree with traditional motifs', 'Premium'),
('Golden Zari Kanchipuram', '₹12,999', '₹16,999', '/api/placeholder/400/600', 'Sarees', 'Kanchipuram', 'Pure silk saree with intricate golden zari work', 'Festive'),
('Temple Border Kanchipuram', '₹18,999', '₹22,999', '/api/placeholder/400/600', 'Sarees', 'Kanchipuram', 'Traditional temple border design in rich silk', 'Bridal'),

-- Banarasi Sarees
('Classic Banarasi Silk', '₹14,999', '₹18,999', '/api/placeholder/400/600', 'Sarees', 'Banarasi', 'Timeless Banarasi silk with mogul patterns', 'Classic'),
('Red Banarasi Bridal', '₹25,999', '₹29,999', '/api/placeholder/400/600', 'Sarees', 'Banarasi', 'Stunning red bridal Banarasi with heavy work', 'Bridal'),

-- Jewelry
('Temple Gold Necklace', '₹45,999', '₹52,999', '/api/placeholder/400/400', 'Jewelry', 'Necklace', 'Traditional temple jewelry in 22K gold', 'Premium'),
('Kundan Earrings Set', '₹8,999', '₹12,999', '/api/placeholder/400/400', 'Jewelry', 'Earrings', 'Beautiful kundan work with pearls', 'Festive'),

-- Gajulu
('Traditional Silk Thread Gajulu', '₹2,999', '₹3,999', '/api/placeholder/400/400', 'Gajulu', 'Silk Thread', 'Handcrafted silk thread gajulu anklets', 'Traditional'),
('Silver Gajulu with Bells', '₹5,999', '₹7,999', '/api/placeholder/400/400', 'Gajulu', 'Silver', 'Pure silver gajulu with traditional bells', 'Premium')

ON CONFLICT (id) DO NOTHING;

-- STEP 7: INSERT SAMPLE OFFERS
-- ============================================

INSERT INTO offers (title, description, image, price, original_price, discount_percentage, category, tag, expires_at) VALUES
('Festive Season Special', 'Exclusive collection for festival celebrations', '/api/placeholder/600/400', '₹9,999', '₹14,999', 33, 'Sarees', 'Limited Time', NOW() + INTERVAL '30 days'),
('Bridal Collection Sale', 'Premium bridal sarees at special prices', '/api/placeholder/600/400', '₹19,999', '₹29,999', 33, 'Bridal', 'Mega Sale', NOW() + INTERVAL '15 days'),
('New Arrival Jewelry', 'Latest designs in temple jewelry', '/api/placeholder/600/400', '₹12,999', '₹18,999', 28, 'Jewelry', 'New Launch', NOW() + INTERVAL '45 days')

ON CONFLICT (id) DO NOTHING;

-- STEP 8: ADD MISSING COLUMNS TO EXISTING TABLES (SAFETY CHECK)
-- ============================================

-- Ensure all columns exist in profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;           -- 🔥 KEY FIX
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- STEP 9: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (users can only access their own profile)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR ALL USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for wishlist
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
CREATE POLICY "Users can manage own wishlist" ON wishlist
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for cart
DROP POLICY IF EXISTS "Users can manage own cart" ON cart;
CREATE POLICY "Users can manage own cart" ON cart
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Public read access for products and offers
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active offers" ON offers;
CREATE POLICY "Public can view active offers" ON offers FOR SELECT USING (is_active = true);

-- STEP 10: VERIFICATION QUERIES
-- ============================================

-- Verify table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'products', 'wishlist', 'cart', 'orders', 'offers')
ORDER BY table_name, ordinal_position;

-- Check if address column exists in profiles
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'address'
        ) 
        THEN '✅ Address column exists in profiles table'
        ELSE '❌ Address column missing from profiles table'
    END as address_status;

-- Show sample data counts
SELECT 
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM offers) as offers_count,
    (SELECT COUNT(*) FROM profiles) as profiles_count;

-- ============================================
-- SETUP COMPLETE! 
-- ============================================
-- 
-- ✅ All tables created with proper structure
-- ✅ Address column included in profiles table
-- ✅ Clerk authentication compatibility (TEXT user IDs)
-- ✅ Triggers and functions set up
-- ✅ Sample data inserted
-- ✅ Row Level Security enabled
-- ✅ Performance indexes created
--
-- Your database is now ready for Sri Durga Sarees!
-- The address column error should be fixed.
-- ============================================