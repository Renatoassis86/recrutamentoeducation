-- Remove unique constraint from CPF for now
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_cpf_key;
