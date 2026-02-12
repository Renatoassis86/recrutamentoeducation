-- EXECUTAR NO SQL EDITOR DO SUPABASE PARA CORRIGIR NOMES NO CHAT E CARGO NA COMISSÃO

-- 1. Garante que a coluna de cargo existe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;

-- 2. Cria relacionamento para permitir o JOIN automático dos nomes no chat
ALTER TABLE public.admin_chat_messages 
DROP CONSTRAINT IF EXISTS admin_chat_messages_admin_id_fkey,
ADD CONSTRAINT admin_chat_messages_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
