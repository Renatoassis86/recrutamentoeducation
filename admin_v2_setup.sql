-- ##################################################################
-- PAIDEIA INTELLIGENCE - ADMIN PANEL V2 SETUP (REAL ESTATE SCHEMA)
-- ##################################################################

-- 1. TABELA DE AUDITORIA (Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    entity TEXT NOT NULL, -- 'applications', 'kanban', 'comms', 'admin_users'
    entity_id UUID,
    action TEXT NOT NULL, -- e.g., 'MOVIMENTAÇÃO_PHASE', 'EXCLUSÃO_REGISTRO'
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

-- 3. CHAT INTERNO (Admin Lounge)
CREATE TABLE IF NOT EXISTS public.admin_chat_messages (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AVALIAÇÕES (Scorecard Técnica)
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

-- 5. CAMPANHAS DE CRM (Bulk Messages)
CREATE TABLE IF NOT EXISTS public.comms_campaigns (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    channel TEXT CHECK (channel IN ('EMAIL', 'WHATSAPP')),
    name TEXT NOT NULL,
    subject TEXT,
    template_body TEXT NOT NULL,
    created_by_admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENSAGENS INDIVIDUAIS (Histórico CRM)
CREATE TABLE IF NOT EXISTS public.comms_messages (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.comms_campaigns(id) ON DELETE SET NULL,
    channel TEXT,
    to_address TEXT,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_by_admin_id UUID REFERENCES auth.users(id)
);

-- ##################################################################
-- RLS POLICIES (SEGURANÇA CORPORATIVA)
-- ##################################################################

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comms_messages ENABLE ROW LEVEL SECURITY;

-- Política Global para Admins (RBAC)
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('audit_log', 'kanban_history', 'admin_chat_messages', 'application_reviews', 'comms_campaigns', 'comms_messages')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Admin full access" ON public.%I FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin''))', t);
    END LOOP;
END $$;

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_application_reviews_modtime
    BEFORE UPDATE ON public.application_reviews
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
