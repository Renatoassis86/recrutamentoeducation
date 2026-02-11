# Backlog do Painel Administrativo - Cidade Viva Education

## Épico 1: Fundação & Governança (@database-architect, @security-auditor)
- [ ] Implementar Schema de Auditoria (`audit_log`)
- [ ] Implementar Gestão de Admins (`admin_users`) com RBAC
- [ ] Configurar Políticas de RLS para acesso restrito Adm
- [ ] Seed de dados iniciais (Admin Master)

## Épico 2: Gestão de Candidatos (ATS) (@backend-specialist, @frontend-specialist)
- [ ] Listagem avançada com filtros multicritério e busca global
- [ ] Máscara de CPF e dados sensíveis (Privacidade)
- [ ] Dossiê completo do candidato (View unificada de todos os campos)
- [ ] Integração de Anexos (PDF Viewer)
- [ ] CRUD de candidaturas com persistência de Auditoria

## Épico 3: Pipeline & Avaliação (@backend-specialist, @frontend-specialist)
- [ ] Sistema de Kanban editorial (7 fases oficiais)
- [ ] Histórico de movimentação no Kanban (`kanban_history`)
- [ ] Scorecard de avaliação técnica (`application_reviews`)
- [ ] Integração de notas e médias no dossiê

## Épico 4: Analytics & BI (@frontend-specialist, @database-architect)
- [ ] Dashboard de KPIs Executivos (Total, Período, Funil)
- [ ] Mapa do Brasil Interativo por UF (`state`)
- [ ] Wordcloud de resumos de experiência
- [ ] Distribuição de áreas de atuação e pós-graduação

## Épico 5: CRM & Comunicação (@backend-specialist)
- [ ] Central de Comunicação (Histórico de mensagens)
- [ ] Disparo individual e massivo via Email/WhatsApp
- [ ] Templates dinâmicos com variáveis de substituição

## Épico 6: Colaboração & Extras (@backend-specialist, @frontend-specialist)
- [ ] Chat Interno entre Admins (`Admin Lounge`)
- [ ] Exportação de dados (CSV/PDF)
- [ ] Relatórios de SLA por fase
