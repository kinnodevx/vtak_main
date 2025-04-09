CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES user_roles(id);

INSERT INTO user_roles (name, description) VALUES
  ('admin', 'Administrador do sistema'),
  ('user', 'Usuário comum'); 