-- 1. Ensure profiles table linked to auth.users exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trigger to create profile on signup (idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Ensure Avatars Bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 4. Storage Policies for Avatars
-- Allow public read access
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow authenticated uploads
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow users to update their own avatars
DROP POLICY IF EXISTS "Anyone can update their own avatar" ON storage.objects;
CREATE POLICY "Anyone can update their own avatar"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- 5. Enable RLS on profiles if not already
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Profiles Access Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );
