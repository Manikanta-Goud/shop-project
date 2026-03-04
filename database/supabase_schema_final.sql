
-- 1. PRODUCTS TABLE
create table if not exists products (
  id serial primary key,
  name text not null,
  price text not null,
  original_price text,
  image text not null,
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
  updated_at timestamp with time zone default now()
);

-- 3. WISHLIST TABLE
create table if not exists wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer references products(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- 4. CART TABLE
create table if not exists cart (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer references products(id) on delete cascade not null,
  quantity integer default 1,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- 5. ORDERS TABLE
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  total_amount text not null,
  status text default 'Pending', -- Pending, Shipped, Delivered, Cancelled
  tracking_id text,
  items jsonb not null, -- Array of objects: [{name, price, quantity, image}]
  created_at timestamp with time zone default now()
);

-- 6. AUTH TRIGGER FOR PROFILES
create or replace function public.handle_new_user()
returns trigger as $$
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
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. LOYALTY HELPER FUNCTION
create or replace function increment_loyalty(row_id uuid, x integer)
returns void as $$
begin
  update profiles
  set loyalty_points = loyalty_points + x
  where id = row_id;
end;
$$ language plpgsql security definer;

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table wishlist enable row level security;
alter table cart enable row level security;
alter table orders enable row level security;
alter table products enable row level security;

-- 9. RLS POLICIES
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can manage own wishlist" on wishlist for all using (auth.uid() = user_id);
create policy "Users can manage own cart" on cart for all using (auth.uid() = user_id);
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
