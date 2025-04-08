-- Criar a nova tabela users no esquema admin
CREATE TABLE admin.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES admin.user_roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copiar os dados da tabela public.users para admin.users
INSERT INTO admin.users (id, name, email, password, created_at)
SELECT id, name, email, password, created_at
FROM public.users; 