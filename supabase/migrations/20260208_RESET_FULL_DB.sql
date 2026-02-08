-- 🚨 ATENÇÃO: ESTE SCRIPT APAGARÁ TODOS OS DADOS DA TABELA DE INSCRIÇÕES 🚨
-- Execute este script no SQL Editor do Supabase para recriar a tabela do zero e corrigir os erros.

-- 1. Apagar a tabela existente (e seus dados)
DROP TABLE IF EXISTS public.applications;

-- 2. Recriar a tabela sem restrições de unicidade no CPF
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Dados Pessoais
    full_name TEXT,
    cpf TEXT, -- Sem UNIQUE
    email TEXT,
    phone TEXT,
    city TEXT,
    state TEXT,
    
    -- Perfil
    profile_type TEXT,
    licensure_area TEXT,
    pedagogy_areas TEXT[], -- Array de textos
    
    -- Formação
    graduation_course TEXT,
    graduation_institution TEXT,
    graduation_year INTEGER,
    postgrad_areas TEXT[],
    
    -- Experiência
    experience_years TEXT,
    experience_summary TEXT,
    
    -- Termos e Status
    terms_accepted JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança (Policies)

-- Permitir que o usuário veja sua própria inscrição
CREATE POLICY "Users can view own application" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

-- Permitir que o usuário crie sua inscrição
CREATE POLICY "Users can insert own application" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Permitir que o usuário atualize sua inscrição
CREATE POLICY "Users can update own application" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Criar índices para performance (opcional, mas recomendado)
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
