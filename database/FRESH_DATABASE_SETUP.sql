-- ============================================
-- SRI DURGA SAREES - COMPLETE DATABASE SETUP
-- ============================================
-- UPDATED FOR CLERK AUTHENTICATION
-- Now using Clerk instead of Supabase Auth - No email limits!
-- Copy this ENTIRE file and run in Supabase SQL Editor
-- This will set up everything from scratch

-- KEY CHANGES FOR CLERK:
-- - profiles.id is now TEXT (Clerk uses text IDs)
-- - wishlist.user_id is TEXT
-- - cart.user_id is TEXT  
-- - orders.user_id is TEXT
-- - No auth triggers (profile creation handled in frontend)

-- ============================================
-- STEP 1: DROP EXISTING TRIGGERS AND FUNCTIONS
-- ============================================

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists update_profiles_updated_at on profiles;
drop trigger if exists update_cart_updated_at on cart;
drop trigger if exists update_offers_updated_at on offers;
drop function if exists public.handle_new_user();
drop function if exists update_updated_at_column();

-- ============================================
-- STEP 2: CREATE OR UPDATE TABLES
-- ============================================

-- Products Table
create table if not exists products (
  id serial primary key,
  name text not null,
  price text not null,
  original_price text,
  image text not null,
  images text[],
  description text,
  tag text,
  category text not null,
  type text not null default 'Saree',
  stock_count integer default 10,
  created_at timestamp with time zone default now()
);

-- Profiles Table (Updated for Clerk - uses TEXT id instead of UUID)
create table if not exists profiles (
  id text primary key,
  full_name text,
  email text,
  phone text,
  address text,
  loyalty_points integer default 0,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Wishlist Table (Updated for Clerk)
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  product_id integer not null,
  created_at timestamp with time zone default now()
);

-- Cart Table (Updated for Clerk)
create table if not exists cart (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  product_id integer not null,
  quantity integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Orders Table (Updated for Clerk)
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  total_amount text not null,
  status text default 'Pending',
  tracking_id text,
  items jsonb not null,
  created_at timestamp with time zone default now()
);

-- Offers Table
create table if not exists offers (
  id serial primary key,
  title text not null,
  description text,
  image text not null,
  price text not null,
  original_price text,
  discount_percentage integer,
  category text not null,
  tag text,
  is_active boolean default true,
  is_featured boolean default false,
  stock_count integer default 0,
  countdown_end timestamp with time zone,
  product_id integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- STEP 3: ADD MISSING COLUMNS (IF TABLES ALREADY EXIST)
-- ============================================

-- Add description and images columns to products if they don't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='description') then
    alter table products add column description text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='images') then
    alter table products add column images text[];
  end if;
end $$;

-- ============================================
-- STEP 4: ADD UNIQUE CONSTRAINTS
-- ============================================

-- Drop existing constraints if they exist
alter table wishlist drop constraint if exists wishlist_user_id_product_id_key;
alter table cart drop constraint if exists cart_user_id_product_id_key;

-- Add unique constraints
alter table wishlist add constraint wishlist_user_id_product_id_key unique (user_id, product_id);
alter table cart add constraint cart_user_id_product_id_key unique (user_id, product_id);

-- ============================================
-- STEP 5: DISABLE RLS FOR DEVELOPMENT
-- ============================================

alter table products disable row level security;
alter table profiles disable row level security;
alter table wishlist disable row level security;
alter table cart disable row level security;
alter table orders disable row level security;
alter table offers disable row level security;

-- ============================================
-- STEP 6: CREATE FUNCTIONS
-- ============================================

-- NOTE: With Clerk authentication, we handle profile creation in the frontend
-- using the useAuth hook. No trigger function needed!

-- Function to auto-update timestamps
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================
-- STEP 7: CREATE TRIGGERS
-- ============================================

-- Note: No auth trigger needed - Clerk handles authentication
-- Profile creation happens in useAuth.tsx

-- Trigger for updating timestamps
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_cart_updated_at
  before update on cart
  for each row
  execute function update_updated_at_column();

create trigger update_offers_updated_at
  before update on offers
  for each row
  execute function update_updated_at_column();

-- ============================================
-- STEP 8: CREATE INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_products_type on products(type);
create index if not exists idx_products_category on products(category);
create index if not exists idx_wishlist_user on wishlist(user_id);
create index if not exists idx_wishlist_product on wishlist(product_id);
create index if not exists idx_cart_user on cart(user_id);
create index if not exists idx_cart_product on cart(product_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_offers_active on offers(is_active);
create index if not exists idx_offers_featured on offers(is_featured);
create index if not exists idx_offers_category on offers(category);

-- ============================================
-- STEP 9: INSERT SAMPLE DATA
-- ============================================

-- Sample Products
insert into products (name, price, original_price, image, tag, category, type, description, stock_count)
values
  ('Kanchipuram Silk Saree', '₹28,999', '₹35,999', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'BESTSELLER', 'Kanchipuram', 'Saree', 'Authentic pure silk saree from Kanchipuram weavers with traditional temple border and intricate zari work', 15),
  ('Banarasi Silk Saree', '₹32,999', '₹42,999', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', 'PREMIUM', 'Banarasi', 'Saree', 'Handwoven Banarasi silk with intricate gold zari work and timeless elegance', 12),
  ('Pochampally Ikkat Saree', '₹18,999', '₹24,999', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', 'NEW', 'Pochampally', 'Saree', 'Traditional Pochampally double ikkat weave with geometric patterns', 20),
  ('Mysore Silk Saree', '₹24,999', '₹31,999', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'TRENDING', 'Mysore Silk', 'Saree', 'Pure Mysore silk with rich colors and soft texture', 18),
  
  ('Temple Gold Necklace', '₹45,999', '₹55,999', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', 'NEW', 'Temple Jewelry', 'Jewelry', 'Traditional South Indian temple jewelry with kundan stones and antique finish', 8),
  ('Diamond Studded Earrings', '₹38,999', '₹49,999', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'PREMIUM', 'Bridal Sets', 'Jewelry', 'Elegant diamond earrings with 18K gold setting', 10),
  ('Antique Gold Bangles', '₹32,999', '₹42,999', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', 'BESTSELLER', 'Antique Gold', 'Jewelry', 'Set of 6 antique gold bangles with intricate carvings', 12),
  
  ('Silver Bangles Anklets', '₹12,999', '₹18,999', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'TRENDING', 'Silver Antique', 'Bangles', 'Handcrafted pure silver anklets with peacock design and ghungroo bells', 25),
  ('Temple Design Bangles', '₹15,999', '₹22,999', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'NEW', 'Temple Gold', 'Bangles', 'Traditional temple design anklets in 22K gold plating', 15),
  ('Glass Festive Bangles', '₹4,999', '₹7,999', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'BESTSELLER', 'Glass Festive', 'Bangles', 'Colorful glass and silk thread anklets perfect for festivals', 50)
on conflict do nothing;

-- Sample Offers
insert into offers (title, description, image, price, original_price, discount_percentage, category, tag, is_active, is_featured, stock_count, countdown_end)
values
  ('Heritage Temple Border Silk', 'Exquisite temple border design with traditional motifs and gold zari work', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', '₹18,999', '₹24,999', 24, 'Sarees', 'TRENDING', true, true, 5, now() + interval '2 days'),
  ('Royal Purple Pattu Silk', 'Handwoven pure silk with intricate gold zari patterns', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', '₹22,499', '₹29,999', 25, 'Sarees', 'LIMITED', true, true, 3, now() + interval '2 days'),
  ('Gold Temple Necklace Set', 'Traditional temple jewelry with intricate design and kundan work', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', '₹45,999', '₹59,999', 23, 'Jewelry', 'NEW ARRIVAL', true, false, 2, null),
  ('Peacock Design Bangles', 'Handcrafted peacock anklets with pure silver and detailed work', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', '₹8,999', '₹12,999', 31, 'Bangles', 'EXCLUSIVE', true, false, 10, null)
on conflict do nothing;

-- ============================================
-- DONE! ✓
-- ============================================
-- Your database is ready!
-- 
-- What's Set Up:
-- ✓ All tables created (products, profiles, wishlist, cart, orders, offers)
-- ✓ RLS disabled for easy development
-- ✓ Auto-profile creation on signup
-- ✓ Auto-timestamp updates
-- ✓ Performance indexes
-- ✓ Sample data for testing
-- 
-- Next Steps:
-- 1. Try signing up - it should work perfectly now!
-- 2. Test wishlist and cart functionality
-- 3. Browse products and add to cart
-- 
-- If you see any errors, check the Output panel in Supabase SQL Editor
