-- ##################################################################
-- PAIDEIA INTELLIGENCE - ADMIN PANEL V2 SETUP (REAL ESTATE SCHEMA)
-- ##################################################################

-- 0. FUNÇÕES DE SUPORTE (Permissões Expandidas)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'committee')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. TABELA DE AUDITORIA (Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    entity TEXT NOT NULL, 
    entity_id UUID,
    action TEXT NOT NULL, 
    before_json JSONB,
    after_json JSONB,
    ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HISTÓRICO KANBAN (Tracking de Movimentação)
CREATE TABLE IF NOT EXISTS public.kanban_history (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT,
    moved_by_admin_id UUID REFERENCES auth.users(id),
    moved_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);

-- 3. CHAT INTERNO (Admin Lounge - Discord Style)
CREATE TABLE IF NOT EXISTS public.admin_chat_messages (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text', -- 'text' ou 'audio'
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTORIZAÇÕES PENDENTES (Workflow de Aprovação)
CREATE TABLE IF NOT EXISTS public.pending_authorizations (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    requested_by UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- 'UPDATE_STATUS', 'DELETE_CANDIDATE', etc.
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AVALIAÇÕES (Scorecard Técnica)
CREATE TABLE IF NOT EXISTS public.application_reviews (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id),
    scores_json JSONB NOT NULL DEFAULT '{}',
    notes TEXT,
    overall_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(application_id, admin_id)
);

-- ##################################################################
-- RLS POLICIES (SEGURANÇA CORPORATIVA)
-- ##################################################################

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_authorizations ENABLE ROW LEVEL SECURITY;

-- Política Global de Acesso para Admin e Comissão
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name IN ('audit_log', 'kanban_history', 'admin_chat_messages', 'application_reviews', 'pending_authorizations')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Committee access" ON public.%I', t);
        
        -- Admin: Total
        EXECUTE format('CREATE POLICY "Admin full access" ON public.%I FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin''))', t);
        
        -- Comissão: Visualização e Criação (Baseado em is_admin() ajustado)
        EXECUTE format('CREATE POLICY "Committee access" ON public.%I FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''committee''))', t);
    END LOOP;
END $$;
