-- Migration: Tabela para códigos de verificação de email (substitui Map em memória)
-- Executar no Railway Postgres antes de fazer deploy

CREATE TABLE IF NOT EXISTS email_verification_codes (
  email VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para limpeza automática de códigos expirados
CREATE INDEX IF NOT EXISTS idx_email_codes_expires ON email_verification_codes(expires_at);

-- Função para limpar códigos expirados automaticamente (opcional, pode correr periodicamente)
-- DELETE FROM email_verification_codes WHERE expires_at < NOW();
