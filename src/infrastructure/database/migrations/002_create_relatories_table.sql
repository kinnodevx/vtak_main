-- Criação da tabela relatories
CREATE TABLE IF NOT EXISTS relatories (
    id SERIAL PRIMARY KEY,
    emission_date DATE NOT NULL,
    date_cession DATE,
    cpf_bancarizador_endossante VARCHAR(14) NOT NULL,
    n_contract VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários da tabela
COMMENT ON TABLE relatories IS 'Tabela para armazenar informações de relatórios';
COMMENT ON COLUMN relatories.id IS 'Identificador único do relatório';
COMMENT ON COLUMN relatories.emission_date IS 'Data de emissão do relatório';
COMMENT ON COLUMN relatories.date_cession IS 'Data de cessão do relatório';
COMMENT ON COLUMN relatories.cpf_bancarizador_endossante IS 'CPF do bancarizador/endossante';
COMMENT ON COLUMN relatories.n_contract IS 'Número do contrato';
COMMENT ON COLUMN relatories.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN relatories.updated_at IS 'Data e hora da última atualização do registro'; 