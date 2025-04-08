-- Adicionar a coluna role_id na tabela de usuários
ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES user_roles(id); 