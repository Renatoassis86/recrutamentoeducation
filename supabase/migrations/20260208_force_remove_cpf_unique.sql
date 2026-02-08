-- Drop the constraint if it exists
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_cpf_key;

-- Drop the unique index if it exists (sometimes created separately)
DROP INDEX IF EXISTS applications_cpf_key;

-- Verify it's gone by checking for any unique indexes on cpf
-- This is just for your verification, running it won't hurt.
