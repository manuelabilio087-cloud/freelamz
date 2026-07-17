-- Permite saber quais pagamentos ao freelancer ja foram transferidos manualmente
-- por ti (Manuel), e quais ainda estao pendentes de pagamento real via M-Pesa.
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payout_status VARCHAR(20) NOT NULL DEFAULT 'pending';
-- valores possiveis: 'pending' (ainda nao transferiste ao freelancer) | 'paid_out' (ja transferiste)
