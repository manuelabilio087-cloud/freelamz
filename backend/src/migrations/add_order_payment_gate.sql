-- Fecha a lacuna entre orders (fluxo gig/Fiverr-style) e payments
-- (que antes só suportava contract_id, fluxo project/Upwork-style).
-- Objectivo: nenhuma order pode ser entregue sem pagamento confirmado.

-- 1. Estado de pagamento explícito na order
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid';
-- valores possíveis: 'unpaid', 'paid', 'refunded'

-- 2. Ligar payments a orders (contract_id já existe e continua a ser usado pelo fluxo de projectos)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL;

-- 3. contract_id tem de deixar de ser obrigatório, porque agora um payment
--    pode pertencer a uma order OU a um contract (nunca aos dois)
ALTER TABLE payments ALTER COLUMN contract_id DROP NOT NULL;

-- 4. Garantir que um payment está sempre ligado a exactamente um dos dois
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_order_or_contract_check;
ALTER TABLE payments ADD CONSTRAINT payments_order_or_contract_check
  CHECK (
    (order_id IS NOT NULL AND contract_id IS NULL) OR
    (order_id IS NULL AND contract_id IS NOT NULL)
  );

-- 5. Orders existentes que já tenham sido entregues/aceites presumem-se pagas,
--    para não bloquear encomendas antigas em produção
UPDATE orders SET payment_status = 'paid'
  WHERE status IN ('delivered', 'completed', 'in_progress', 'revision_requested')
  AND payment_status = 'unpaid';
