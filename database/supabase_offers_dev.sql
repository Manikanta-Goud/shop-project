-- ============================================
-- QUICK SETUP FOR DEVELOPMENT (USE NOW)
-- ============================================
-- Run this SQL in Supabase SQL Editor to get started immediately
-- This disables RLS for easy testing - NOT for production

-- Create table
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

-- Disable RLS for easy development
alter table offers disable row level security;

-- Auto-update timestamp
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

-- Indexes
create index if not exists idx_offers_active on offers(is_active);
create index if not exists idx_offers_featured on offers(is_featured);
create index if not exists idx_offers_category on offers(category);

-- Sample test data
insert into offers (title, description, image, price, original_price, discount_percentage, category, tag, is_active, is_featured, stock_count, countdown_end) values
('Heritage Temple Border Silk', 'Exquisite temple border design with traditional motifs', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', '₹18,999', '₹24,999', 24, 'Sarees', 'TRENDING', true, true, 5, now() + interval '2 days'),
('Royal Purple Pattu Silk', 'Handwoven pure silk with gold zari work', 'https://images.unsplash.com/photo-1583391733981-bdad3e6e8f3b?w=800', '₹22,499', '₹29,999', 25, 'Sarees', 'LIMITED', true, true, 3, now() + interval '2 days'),
('Gold Temple Necklace Set', 'Traditional temple jewelry with intricate design', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', '₹45,999', '₹59,999', 23, 'Jewelry', 'NEW ARRIVAL', true, false, 2, null),
('Peacock Design Gajulu', 'Handcrafted peacock anklets with pure silver', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', '₹8,999', '₹12,999', 31, 'Gajulu', 'EXCLUSIVE', true, false, 10, null)
on conflict do nothing;

-- Success message
do $$
begin
  raise notice '✅ Development setup complete! RLS is DISABLED for easy testing.';
  raise notice 'ℹ️  You can now add/edit/delete offers without authentication.';
  raise notice '⚠️  When ready for production, use supabase_offers_production.sql';
end $$;
