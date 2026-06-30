-- =====================================================
-- Migração: Funcionalidades estilo Fiverr (Fases 1-4)
-- Executar no Railway Postgres (Database > Query)
-- =====================================================

-- ---------- FASE 1: Encomendas, entregas, revisões ----------

-- Garantir colunas necessárias em orders (caso já exista)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS revisions_used INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS revisions_allowed INTEGER DEFAULT 1;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS auto_complete_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS extra_delivery_days INTEGER DEFAULT 0;

-- Entregas de trabalho (o freelancer entrega ficheiros/mensagem)
CREATE TABLE IF NOT EXISTS order_deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  message TEXT,
  files JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos de revisão feitos pelo cliente
CREATE TABLE IF NOT EXISTS order_revision_requests (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ---------- FASE 2: Descoberta e pesquisa ----------

-- Categorias de gigs
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  display_order INTEGER DEFAULT 0
);

INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Design Gráfico', 'design-grafico', 'ti-palette', 1),
  ('Programação e Tecnologia', 'programacao', 'ti-code', 2),
  ('Marketing Digital', 'marketing', 'ti-speakerphone', 3),
  ('Redação e Tradução', 'redacao', 'ti-pencil', 4),
  ('Vídeo e Animação', 'video', 'ti-video', 5),
  ('Música e Áudio', 'musica', 'ti-music', 6),
  ('Negócios', 'negocios', 'ti-briefcase', 7),
  ('Fotografia', 'fotografia', 'ti-camera', 8)
ON CONFLICT (slug) DO NOTHING;

-- Favoritos (gigs e freelancers guardados)
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gig_id INTEGER REFERENCES gigs(id) ON DELETE CASCADE,
  freelancer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT favorite_target_check CHECK (
    (gig_id IS NOT NULL AND freelancer_id IS NULL) OR
    (gig_id IS NULL AND freelancer_id IS NOT NULL)
  ),
  UNIQUE(user_id, gig_id),
  UNIQUE(user_id, freelancer_id)
);

-- Contadores de visualização e cliques em gigs (para analytics da fase 4)
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS orders_count INTEGER DEFAULT 0;
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

-- ---------- FASE 3: Confiança e reputação ----------

-- Nível de freelancer + estatísticas de reputação
ALTER TABLE users ADD COLUMN IF NOT EXISTS seller_level VARCHAR(20) DEFAULT 'new' CHECK (seller_level IN ('new', 'level_1', 'level_2', 'top_rated'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS response_time_avg INTEGER DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS completion_rate NUMERIC(5,2) DEFAULT 100.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS member_since TIMESTAMP DEFAULT NOW();

-- Itens de portfólio
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Testes de competências e badges
CREATE TABLE IF NOT EXISTS skill_tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  questions JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS user_skill_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_test_id INTEGER NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN DEFAULT false,
  taken_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_test_id)
);

-- ---------- FASE 4: Monetização e crescimento ----------

-- Programa de afiliados
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES users(id);

CREATE TABLE IF NOT EXISTS referral_earnings (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics de gig (eventos diários agregados)
CREATE TABLE IF NOT EXISTS gig_analytics (
  id SERIAL PRIMARY KEY,
  gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  UNIQUE(gig_id, date)
);

-- ---------- Índices de performance ----------
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_freelancer ON orders(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_gig_analytics_gig_date ON gig_analytics(gig_id, date);
