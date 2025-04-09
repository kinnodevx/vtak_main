-- Adicionar uma chave de API padrão para uso imediato
INSERT INTO admin.access_tokens (ci, cs, agent, created_at, updated_at)
VALUES (
  'default_client_id_123456789', 
  'default_client_secret_123456789', 
  'admin-generated',
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP
)
ON CONFLICT (ci) DO NOTHING; 