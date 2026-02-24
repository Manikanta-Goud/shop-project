-- ============================================
-- COMPLETE DATABASE SETUP - FIXED
-- ============================================
-- Run this in Supabase SQL Editor to fix signup issues

-- 1. PRODUCTS TABLE
create table if not exists products (
  id serial primary key,
  name text not null,
  price text not null,
  original_price text,
  image text not null,
  images text[], -- Array of image URLs for gallery
  description text,
  tag text,
  category text not null,
  type text not null default 'Saree', -- Saree, Gajulu, Jewelry
  stock_count integer default 10,
  created_at timestamp with time zone default now()
);

-- 2. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  phone text,
  address text,
  loyalty_points integer default 0,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. WISHLIST TABLE
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer references products(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- 4. CART TABLE
create table if not exists cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer references products(id) on delete cascade not null,
  quantity integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- 5. ORDERS TABLE
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  total_amount text not null,
  status text default 'Pending', -- Pending, Shipped, Delivered, Cancelled
  tracking_id text,
  items jsonb not null, -- Array of objects: [{name, price, quantity, image}]
  created_at timestamp with time zone default now()
);

-- 6. OFFERS TABLE
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
  product_id integer references products(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- DISABLE RLS FOR EASY DEVELOPMENT
-- ============================================
-- This makes all tables accessible without complex policies
-- Re-enable and add proper policies when deploying to production

alter table profiles disable row level security;
alter table wishlist disable row level security;
alter table cart disable row level security;
alter table orders disable row level security;
alter table products disable row level security;
alter table offers disable row level security;

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

-- Function to create profile when user signs up
create or replace function public.handle_new_user()
returns trigger 
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, address, loyalty_points)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address',
    0
  );
  return new;
end;
$$;

-- Remove old trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Function for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for auto-updating timestamps
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_cart_updated_at on cart;
create trigger update_cart_updated_at
  before update on cart
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_offers_updated_at on offers;
create trigger update_offers_updated_at
  before update on offers
  for each row
  execute function update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

create index if not exists idx_products_type on products(type);
create index if not exists idx_products_category on products(category);
create index if not exists idx_wishlist_user on wishlist(user_id);
create index if not exists idx_cart_user on cart(user_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_offers_active on offers(is_active);
create index if not exists idx_offers_featured on offers(is_featured);

-- ============================================
-- SAMPLE DATA (OPTIONAL - DELETE FROM ADMIN)
-- ============================================

-- Sample Products
insert into products (name, price, original_price, image, tag, category, type, description) values
('Kanchipuram Silk Saree', '₹28,999', '₹35,999', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'BESTSELLER', 'Kanchipuram', 'Saree', 'Authentic pure silk saree from Kanchipuram weavers with traditional temple border'),
('Banarasi Silk Saree', '₹32,999', '₹42,999', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', 'PREMIUM', 'Banarasi', 'Saree', 'Handwoven Banarasi silk with intricate gold zari work'),
('Temple Jewelry Necklace', '₹45,999', '₹55,999', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', 'NEW', 'Temple Jewelry', 'Jewelry', 'Traditional South Indian temple jewelry with kundan stones'),
('Silver Gajulu Anklets', '₹12,999', '₹18,999', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'TRENDING', 'Silver Antique', 'Gajulu', 'Handcrafted pure silver anklets with peacock design')
on conflict do nothing;

-- Sample Offers
insert into offers (title, description, image, price, original_price, discount_percentage, category, tag, is_active, is_featured, stock_count, countdown_end) values
('Heritage Temple Border Silk', 'Exquisite temple border design with traditional motifs', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', '₹18,999', '₹24,999', 24, 'Sarees', 'TRENDING', true, true, 5, now() + interval '2 days'),
('Royal Purple Pattu Silk', 'Handwoven pure silk with gold zari work', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', '₹22,499', '₹29,999', 25, 'Sarees', 'LIMITED', true, true, 3, now() + interval '2 days')
on conflict do nothing;

-- ============================================
-- DONE! 
-- ============================================
-- Your database is now ready!
-- - All tables created
-- - RLS disabled for easy development
-- - Auto-profile creation on signup enabled
-- - Sample data added for testing
