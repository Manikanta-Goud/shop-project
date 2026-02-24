-- OFFERS/PROMOTIONS TABLE
-- This table stores promotional offers that can be displayed on the home page
-- and managed from the admin portal

create table if not exists offers (
  id serial primary key,
  title text not null,
  description text,
  image text not null,
  price text not null,
  original_price text,
  discount_percentage integer,
  category text not null, -- e.g., 'Sarees', 'Gajulu', 'Jewelry', 'Bridal', 'Festival'
  tag text, -- e.g., 'NEW ARRIVAL', 'TRENDING', 'LIMITED'
  is_active boolean default true,
  is_featured boolean default false, -- Show in Limited Edition Drops section
  stock_count integer default 0,
  countdown_end timestamp with time zone, -- For limited time offers
  product_id integer references products(id) on delete set null, -- Optional link to actual product
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- FOR DEVELOPMENT: Disable RLS (TEMPORARY)
-- ============================================
-- Uncomment this line for development/testing:
alter table offers disable row level security;

-- ============================================
-- FOR PRODUCTION: Enable RLS with proper policies
-- ============================================
-- When ready for production, comment out the disable line above
-- and uncomment the section below:

/*
-- Enable RLS for offers table
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

-- Create proper RLS policies for production
create policy "Anyone can view offers"
  on offers for select
  using (true);

create policy "Authenticated users can insert offers"
  on offers for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update offers"
  on offers for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete offers"
  on offers for delete
  to authenticated
  using (true);
*/

-- Function to automatically update the updated_at timestamp
create or replace function update_offers_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to call the function before update
drop trigger if exists offers_updated_at_trigger on offers;
create trigger offers_updated_at_trigger
  before update on offers
  for each row
  execute function update_offers_updated_at();

-- Create index for faster queries
create index if not exists idx_offers_active on offers(is_active);
create index if not exists idx_offers_featured on offers(is_featured);
create index if not exists idx_offers_category on offers(category);

-- Sample data for offers (you can remove this after testing)
insert into offers (title, description, image, price, original_price, discount_percentage, category, tag, is_active, is_featured, stock_count, countdown_end) values
('Heritage Temple Border Silk', 'Exquisite temple border design with traditional motifs', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', '₹18,999', '₹24,999', 24, 'Sarees', 'TRENDING', true, true, 5, now() + interval '2 days'),
('Royal Purple Pattu Silk', 'Handwoven pure silk with gold zari work', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', '₹22,499', '₹29,999', 25, 'Sarees', 'LIMITED', true, true, 3, now() + interval '2 days'),
('Gold Temple Necklace Set', 'Traditional temple jewelry with intricate design', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', '₹45,999', '₹59,999', 23, 'Jewelry', 'NEW ARRIVAL', true, false, 2, null),
('Peacock Design Gajulu', 'Handcrafted peacock anklets with pure silver', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', '₹8,999', '₹12,999', 31, 'Gajulu', 'EXCLUSIVE', true, false, 10, null);

-- Function to get active featured offers (for Limited Edition Drops)
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

-- Function to get offers by category
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
