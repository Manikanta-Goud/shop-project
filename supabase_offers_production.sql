-- ============================================
-- PRODUCTION-READY OFFERS TABLE WITH RLS
-- ============================================
-- Run this SQL in Supabase when ready for production deployment
-- Requires: Admin users to be created in Supabase Auth

-- OFFERS/PROMOTIONS TABLE
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

-- Enable Row Level Security
alter table offers enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Offers are viewable by everyone" on offers;
drop policy if exists "Only authenticated users can insert offers" on offers;
drop policy if exists "Only authenticated users can update offers" on offers;
drop policy if exists "Only authenticated users can delete offers" on offers;
drop policy if exists "Authenticated users can insert offers" on offers;
drop policy if exists "Authenticated users can update offers" on offers;
drop policy if exists "Authenticated users can delete offers" on offers;
drop policy if exists "Anyone can view offers" on offers;

-- ============================================
-- RLS POLICIES FOR PRODUCTION
-- ============================================

-- 1. Public can view all offers (for website visitors)
create policy "Anyone can view offers"
  on offers for select
  using (true);

-- 2. Authenticated users can insert offers (for admins)
create policy "Authenticated users can insert offers"
  on offers for insert
  to authenticated
  with check (true);

-- 3. Authenticated users can update offers (for admins)
create policy "Authenticated users can update offers"
  on offers for update
  to authenticated
  using (true)
  with check (true);

-- 4. Authenticated users can delete offers (for admins)
create policy "Authenticated users can delete offers"
  on offers for delete
  to authenticated
  using (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
create or replace function update_offers_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists offers_updated_at_trigger on offers;
create trigger offers_updated_at_trigger
  before update on offers
  for each row
  execute function update_offers_updated_at();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_offers_active on offers(is_active);
create index if not exists idx_offers_featured on offers(is_featured);
create index if not exists idx_offers_category on offers(category);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get active featured offers (for Limited Edition Drops)
create or replace function get_featured_offers()
returns table (
  id integer,
  title text,
  description text,
  image text,
  price text,
  original_price text,
  discount_percentage integer,
  category text,
  tag text,
  stock_count integer,
  countdown_end timestamp with time zone
) as $$
begin
  return query
  select 
    o.id, o.title, o.description, o.image, o.price, 
    o.original_price, o.discount_percentage, o.category, 
    o.tag, o.stock_count, o.countdown_end
  from offers o
  where o.is_active = true and o.is_featured = true
  order by o.created_at desc;
end;
$$ language plpgsql;

-- Get offers by category
create or replace function get_offers_by_category(category_name text)
returns table (
  id integer,
  title text,
  description text,
  image text,
  price text,
  original_price text,
  discount_percentage integer,
  category text,
  tag text,
  stock_count integer,
  is_featured boolean,
  created_at timestamp with time zone
) as $$
begin
  return query
  select 
    o.id, o.title, o.description, o.image, o.price, 
    o.original_price, o.discount_percentage, o.category, 
    o.tag, o.stock_count, o.is_featured, o.created_at
  from offers o
  where o.is_active = true and o.category = category_name
  order by o.created_at desc;
end;
$$ language plpgsql;

-- ============================================
-- DEPLOYMENT CHECKLIST
-- ============================================
-- Before deploying to production:
-- 
-- 1. Create Admin User in Supabase:
--    - Dashboard → Authentication → Users → Add User
--    - Email: admin@gmail.com (or your email)
--    - Password: Your secure password
--
-- 2. Run this entire SQL file in Supabase SQL Editor
--
-- 3. Test login in admin portal (/admin)
--    - Should use real Supabase authentication
--
-- 4. Verify policies:
--    - Public can view offers (website)
--    - Only logged-in admins can add/edit/delete
--
-- 5. Optional: Add sample data below for testing
--    (Remove before production deployment)
/*
insert into offers (title, description, image, price, original_price, discount_percentage, category, tag, is_active, is_featured, stock_count, countdown_end) values
('Heritage Temple Border Silk', 'Exquisite temple border design', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', '₹18,999', '₹24,999', 24, 'Sarees', 'TRENDING', true, true, 5, now() + interval '2 days'),
('Royal Purple Pattu Silk', 'Handwoven pure silk', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', '₹22,499', '₹29,999', 25, 'Sarees', 'LIMITED', true, true, 3, now() + interval '2 days');
*/
