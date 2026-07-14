-- Guarda as preferencias recolhidas no onboarding do cliente (intencao, categorias
-- de interesse, faixa de orcamento) num unico campo flexivel, para nao precisarmos
-- de andar sempre a adicionar colunas novas cada vez que o onboarding cresce.
ALTER TABLE users ADD COLUMN IF NOT EXISTS client_preferences JSONB DEFAULT '{}'::jsonb;
