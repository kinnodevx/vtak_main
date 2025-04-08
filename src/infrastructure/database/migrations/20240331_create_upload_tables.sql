-- Criação da tabela de uploads
CREATE TABLE IF NOT EXISTS admin.uploads (
    id SERIAL PRIMARY KEY,
    directory_name VARCHAR(255) NOT NULL,
    total_size BIGINT NOT NULL,
    files_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de arquivos de upload
CREATE TABLE IF NOT EXISTS admin.upload_files (
    id SERIAL PRIMARY KEY,
    upload_id INTEGER NOT NULL REFERENCES admin.uploads(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_uploads_directory_name ON admin.uploads(directory_name);
CREATE INDEX IF NOT EXISTS idx_upload_files_upload_id ON admin.upload_files(upload_id);
CREATE INDEX IF NOT EXISTS idx_upload_files_file_name ON admin.upload_files(file_name);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION admin.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uploads_updated_at
    BEFORE UPDATE ON admin.uploads
    FOR EACH ROW
    EXECUTE FUNCTION admin.update_updated_at_column();

CREATE TRIGGER update_upload_files_updated_at
    BEFORE UPDATE ON admin.upload_files
    FOR EACH ROW
    EXECUTE FUNCTION admin.update_updated_at_column(); 