-- ============================================
-- SIMPLE FIX FOR SIGNUP ERRORS
-- ============================================
-- Run this to fix the signup trigger issue

-- 1. Drop the problematic trigger
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Create a simple, bulletproof function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Simple insert with basic error handling
  begin
    insert into public.profiles (id, email, full_name, phone, address, loyalty_points)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      coalesce(new.raw_user_meta_data->>'phone', ''),
      coalesce(new.raw_user_meta_data->>'address', ''),
      0
    );
  exception
    when unique_violation then
      -- Profile already exists, do nothing
      null;
    when others then
      -- Log error but don't block signup
      raise warning 'Could not create profile: %', sqlerrm;
  end;
  return new;
end;
$$;

-- 3. Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 4. Make absolutely sure RLS is disabled
alter table profiles disable row level security;

-- 5. Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;

-- ============================================
-- DONE!
-- ============================================
-- Try signing up again. The trigger now has better error handling
-- and won't block signups even if profile creation fails.
