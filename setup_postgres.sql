-- Criar usuário admin
CREATE USER admin WITH PASSWORD '123456aA@' CREATEDB;

-- Criar banco de dados
CREATE DATABASE vtak_db;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE vtak_db TO admin;

-- Conectar ao banco de dados
\c vtak_db

-- Criar tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conceder privilégios na tabela
GRANT ALL PRIVILEGES ON TABLE users TO admin;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO admin; 