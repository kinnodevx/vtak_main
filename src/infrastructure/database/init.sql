-- Criar banco de dados se não existir
CREATE DATABASE vtak_db;

-- Conectar ao banco de dados
\c vtak_db;

-- Criar esquema admin se não existir
CREATE SCHEMA IF NOT EXISTS admin;

-- Criar tabela de roles de usuário
CREATE TABLE IF NOT EXISTS admin.user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir roles padrão
INSERT INTO admin.user_roles (name, description) 
VALUES 
  ('admin', 'Administrador do sistema'),
  ('user', 'Usuário comum')
ON CONFLICT (name) DO NOTHING;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS admin.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES admin.user_roles(id) DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de tokens de acesso
CREATE TABLE IF NOT EXISTS admin.access_tokens (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(255) NOT NULL UNIQUE,
    cs VARCHAR(255) NOT NULL,
    agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON admin.users(email);
CREATE INDEX IF NOT EXISTS idx_access_tokens_ci ON admin.access_tokens(ci);

-- Criar usuário admin padrão (senha: admin123)
INSERT INTO admin.users (name, email, password, role_id)
VALUES ('Admin', 'admin@vtak.com', '$2b$10$tZmUsldwSFZCWXRIKqzH1.G9vBwKPOvNKLyPkS.K8Az5lUCyLtPOi', 1)
ON CONFLICT (email) DO NOTHING;

-- Criar um token de acesso padrão para testes
INSERT INTO admin.access_tokens (ci, cs, agent)
VALUES ('test_client_id', 'test_client_secret', 'Test Environment')
ON CONFLICT (ci) DO NOTHING; 