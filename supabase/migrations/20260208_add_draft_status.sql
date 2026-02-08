-- Adiciona o status 'draft' ao enum app_status
ALTER TYPE app_status ADD VALUE IF NOT EXISTS 'draft';
