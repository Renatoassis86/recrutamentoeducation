-- Add CPF column to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS cpf text;

-- Add unique constraint to CPF
ALTER TABLE public.applications 
ADD CONSTRAINT applications_cpf_key UNIQUE (cpf);

-- Add comment
COMMENT ON COLUMN public.applications.cpf IS 'CPF do candidato (apenas números)';
