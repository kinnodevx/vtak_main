-- Criar o schema admin se não existir
CREATE SCHEMA IF NOT EXISTS admin;

-- Criar a tabela reports
CREATE TABLE IF NOT EXISTS admin.reports (
    id SERIAL PRIMARY KEY,
    directory_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar a tabela report_files
CREATE TABLE IF NOT EXISTS admin.report_files (
    id SERIAL PRIMARY KEY,
    upload_id INTEGER NOT NULL REFERENCES admin.reports(id),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar a tabela access_tokens
CREATE TABLE IF NOT EXISTS admin.access_tokens (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(255) NOT NULL UNIQUE,
    cs VARCHAR(255) NOT NULL,
    agent VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_reports_directory_name ON admin.reports(directory_name);
CREATE INDEX IF NOT EXISTS idx_reports_uploaded_by ON admin.reports(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_report_files_upload_id ON admin.report_files(upload_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_ci ON admin.access_tokens(ci); 