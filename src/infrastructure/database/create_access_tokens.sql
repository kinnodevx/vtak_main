CREATE TABLE IF NOT EXISTS access_tokens (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(255) NOT NULL UNIQUE,
    cs VARCHAR(255) NOT NULL,
    agent VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 