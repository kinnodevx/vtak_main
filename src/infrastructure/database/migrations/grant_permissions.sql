-- Conceder permissões para o usuário admin
GRANT ALL PRIVILEGES ON TABLE users TO admin;
GRANT ALL PRIVILEGES ON TABLE user_roles TO admin;
GRANT USAGE, SELECT ON SEQUENCE user_roles_id_seq TO admin;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO admin; 