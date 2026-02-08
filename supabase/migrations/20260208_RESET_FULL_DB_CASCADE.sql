-- 🚨 RESET COMPLETO COM CASCADE 🚨
-- Este script apaga e recria todas as tabelas relacionadas à inscrição para corrigir problemas de dependência e travas.

-- 1. Apagar tabelas dependentes e a principal com CASCADE
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;

-- 2. Recriar tabela APPLICATIONS (SEM trava de CPF)
CREATE TABLE public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status app_status NOT NULL DEFAULT 'received',
    
    -- Dados Pessoais
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    cpf TEXT, -- Removido UNIQUE e NOT NULL para garantir
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

-- 3. Recriar tabelas dependentes

-- DOCUMENTS
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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
  sender_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
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

-- 4. Habilitar RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 5. Recriar Policies

-- APPLICATIONS POLICIES
CREATE POLICY "Candidates can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Candidates can update own applications if allowed" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all applications" ON public.applications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- DOCUMENTS POLICIES
CREATE POLICY "Candidates can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages for their application" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND (
      EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
);

-- EMAIL LOGS POLICIES (Simplificado para admin)
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
