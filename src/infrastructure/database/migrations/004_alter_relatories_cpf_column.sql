-- Altera a tabela relatories para aumentar o tamanho da coluna cpf_bancarizador_endossante
ALTER TABLE relatories ALTER COLUMN cpf_bancarizador_endossante TYPE VARCHAR(20); 