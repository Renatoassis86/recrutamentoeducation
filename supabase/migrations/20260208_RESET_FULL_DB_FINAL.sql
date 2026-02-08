-- 🚨 RESET COMPLETO COM TIPOS E TABELAS 🚨
-- Este script resolve o erro "type app_status does not exist" e "depends on it".

-- 1. Apagar tabelas dependentes com CASCADE
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;

-- 2. Apagar e Recriar Tipos (ENUMs)
DROP TYPE IF EXISTS app_status CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;

CREATE TYPE app_role AS ENUM ('candidate', 'admin');
CREATE TYPE app_status AS ENUM ('draft', 'received', 'under_review', 'info_requested', 'interview_invited', 'closed');

-- 2.1 Criar Buckets (Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('applications', 'applications', false) ON CONFLICT (id) DO NOTHING;

-- 2.2 Storage Policies (Simplificadas)
-- Avatars (Public Read, Auth Insert) / Applications (Auth Read/Insert) - Policies are usually created specifically, checking below...

-- 3. Recriar tabela APPLICATIONS (SEM trava de CPF)
CREATE TABLE public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Referência direta ao auth.users ou profiles se preferir, aqui usando auth.users para garantir e profiles via trigger se existir
    status app_status NOT NULL DEFAULT 'received',
    
    -- Dados Pessoais
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    cpf TEXT, -- SEM UNIQUE!
    phone TEXT,
    city TEXT,
    state TEXT,
    
    -- Perfil
    profile_type TEXT NOT NULL,
    licensure_area TEXT,
    pedagogy_areas TEXT[],
    
    -- Formação
    graduation_course TEXT,
    graduation_institution TEXT,
    graduation_year INTEGER,
    postgrad_areas TEXT[],
    
    -- Experiência
    experience_years TEXT,
    experience_summary TEXT,
    
    -- Termos
    terms_accepted JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Recriar tabelas dependentes

-- DOCUMENTS
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MESSAGES
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  sender_role app_role NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EMAIL LOGS
CREATE TABLE public.email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  template_key TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Habilitar RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 6. Recriar Policies (Simplificadas para auth.uid())

-- APPLICATIONS POLICIES
CREATE POLICY "Candidates can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Candidates can update own applications if allowed" ON public.applications FOR UPDATE USING (auth.uid() = user_id);

-- DOCUMENTS POLICIES
CREATE POLICY "Candidates can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages for their application" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.user_id = auth.uid())
);
