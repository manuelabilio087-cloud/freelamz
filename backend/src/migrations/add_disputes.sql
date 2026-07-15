-- disputes nunca existiu em producao (disputeController.js sempre assumiu que existia).
-- Desenhada desde o inicio para suportar tanto orders (gig-flow) como contracts (project-flow).
CREATE TABLE IF NOT EXISTS disputes (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  opened_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT disputes_order_or_contract_check CHECK (
    (order_id IS NOT NULL AND contract_id IS NULL) OR
    (order_id IS NULL AND contract_id IS NOT NULL)
  )
);
