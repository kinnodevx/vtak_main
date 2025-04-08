-- Criar a tabela de roles
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir roles padrão
INSERT INTO user_roles (name, description) VALUES
  ('admin', 'Administrador do sistema'),
  ('user', 'Usuário comum'); 