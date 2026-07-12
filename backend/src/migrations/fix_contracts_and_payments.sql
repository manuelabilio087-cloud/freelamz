-- ============================================================
-- BLOCO 1: criar a tabela contracts, que nunca existiu em produção
-- (contractController.js sempre assumiu que existia)
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  freelancer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  terms TEXT NOT NULL,
  milestones JSONB DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  client_signed BOOLEAN NOT NULL DEFAULT false,
  client_signed_at TIMESTAMP,
  freelancer_signed BOOLEAN NOT NULL DEFAULT false,
  freelancer_signed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BLOCO 2: actualizar payments para a estrutura que o código usa
-- (payments só tinha: id, project_id, client_id, freelancer_id, amount, status, created_at)
-- ============================================================
ALTER TABLE payments ADD COLUMN IF NOT EXISTS contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS mpesa_number VARCHAR(20);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS mpesa_transaction_id VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- payer_id/receiver_id substituem client_id/freelancer_id (nomes novos usados pelo controller).
-- Copia os dados antigos para as colunas novas, para não perder histórico:
UPDATE payments SET payer_id = client_id WHERE payer_id IS NULL AND client_id IS NOT NULL;
UPDATE payments SET receiver_id = freelancer_id WHERE receiver_id IS NULL AND freelancer_id IS NOT NULL;

-- Garantir que cada payment está ligado a UMA order OU UM contract, nunca os dois nem nenhum,
-- mas só aplicado a partir de agora (não aos registos antigos, que podem não ter nenhum dos dois)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_order_or_contract_check;
ALTER TABLE payments ADD CONSTRAINT payments_order_or_contract_check
  CHECK (
    order_id IS NULL OR contract_id IS NULL
  );

-- ============================================================
-- BLOCO 3: payment_status em orders (gate de pagamento do gig-flow)
-- ============================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid';

UPDATE orders SET payment_status = 'paid'
  WHERE status IN ('delivered', 'completed', 'in_progress', 'revision_requested')
  AND payment_status = 'unpaid';
