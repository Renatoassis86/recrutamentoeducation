-- Add lattes_url to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS lattes_url text;

COMMENT ON COLUMN public.applications.lattes_url IS 'Link para o currículo Lattes do candidato';
