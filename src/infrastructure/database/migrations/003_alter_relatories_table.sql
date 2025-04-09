-- Altera a tabela relatories para permitir valores nulos na coluna date_cession
ALTER TABLE relatories ALTER COLUMN date_cession DROP NOT NULL; 