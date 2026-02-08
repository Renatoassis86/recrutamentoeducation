-- Add avatar_url to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url text;

COMMENT ON COLUMN public.profiles.avatar_url IS 'URL da foto de perfil do usuário';

-- Create storage bucket for avatars if it doesn't exist (policy handled usually in dashboard but we can try to add valid public policy here if needed, or rely on existing 'applications' bucket logic for simplicity or create a new 'avatars' bucket)
-- For simplicity, we will use the 'applications' bucket or a new 'avatars' folder inside it, or just a new bucket. 
-- Let's stick to adding the column first. Storage policies are complex to script safely without knowing existing config often.
