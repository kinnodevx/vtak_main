-- Criar a tabela de roles
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar a coluna role_id na tabela de usuários
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES user_roles(id);

-- Inserir roles padrão
INSERT INTO user_roles (name, description) VALUES
  ('admin', 'Administrador do sistema'),
  ('user', 'Usuário comum')
ON CONFLICT (name) DO NOTHING; 