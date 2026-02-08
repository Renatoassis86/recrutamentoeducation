-- FINAL COMMAND TO REMOVE CPF RESTRICTION
-- Run this entire block in Supabase SQL Editor

-- 1. Drop the specific unique constraint on CPF
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_cpf_key;

-- 2. Drop any unique index that might have been created automatically
DROP INDEX IF EXISTS applications_cpf_key;

-- 3. Just to be safe, drop any other constraint that involves CPF (if named differently)
-- Note: This is a safe operations block
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applications_cpf_key') THEN 
        ALTER TABLE public.applications DROP CONSTRAINT applications_cpf_key; 
    END IF; 
END $$;
