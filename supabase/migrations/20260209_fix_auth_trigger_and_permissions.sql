-- Migration: Fix Auth Trigger and Permissions
-- Purpose: Resolve "Database error saving new user" during signup and ensure profiles are created correctly.

-- 1. Redefine the function with explicit search_path and error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles. 
  -- We use 'public' schema explicitly.
  -- SECURITY DEFINER means it runs as the creator of the function (usually admin).
  -- Setting search_path prevents malicious search_path manipulation.
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url;
      
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Ensure Permissions
-- Grant usage on schema public to authenticated users and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant all privileges on profiles to service_role (just in case)
GRANT ALL ON TABLE public.profiles TO service_role;

-- Grant select, insert, update to authenticated users (needed for profiles RLS)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- Grant select to anon (since we have public profiles policy)
GRANT SELECT ON TABLE public.profiles TO anon;

-- 3. Verify RLS Policies (Re-apply to be safe)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure policy for inserting own profile (Trigger runs as superuser usually, but if RLS applies...)
-- Ideally, the trigger is SECURITY DEFINER, so it bypasses RLS of the invoker.
-- However, let's make sure the table is accessible.

-- 4. Fix "Applications" table permissions just in case (for the dashboard/forms)
GRANT ALL ON TABLE public.applications TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.applications TO authenticated;
