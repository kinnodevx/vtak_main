-- Adicionar a coluna role_id na tabela public.users
ALTER TABLE public.users ADD COLUMN role_id INTEGER REFERENCES admin.user_roles(id); 