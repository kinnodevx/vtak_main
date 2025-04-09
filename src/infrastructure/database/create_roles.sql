-- Criar tabela de roles
CREATE TABLE IF NOT EXISTS admin.user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna role_id na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES admin.user_roles(id);

-- Inserir roles padrão
INSERT INTO admin.user_roles (name, description) VALUES
    ('admin', 'Administrador do sistema com acesso total'),
    ('manager', 'Gerente com acesso a recursos de gerenciamento'),
    ('user', 'Usuário comum com acesso básico')
ON CONFLICT (name) DO NOTHING; 