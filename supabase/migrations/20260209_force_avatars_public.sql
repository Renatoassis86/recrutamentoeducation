-- FORCE AVATARS BUCKET PUBLIC
-- Run this script in the Supabase SQL Editor

-- 1. Ensure the bucket exists and is PUBLIC
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 2. Drop all existing policies for avatars to start fresh
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own avatar" ON storage.objects;

-- 3. Create permissive policies for Avatars

-- Public Read Access
CREATE POLICY "Public Read Avatars"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Authenticated Upload Access (INSERT)
CREATE POLICY "Auth Upload Avatars"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- User Update Access (UPDATE) - Allow users to update their own files
CREATE POLICY "Auth Update Avatars"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- 4. Verify Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Profile Policies
DROP POLICY IF EXISTS "Public Profiles" ON public.profiles;
CREATE POLICY "Public Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Self Insert Profiles" ON public.profiles;
CREATE POLICY "Self Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Self Update Profiles" ON public.profiles;
CREATE POLICY "Self Update Profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
