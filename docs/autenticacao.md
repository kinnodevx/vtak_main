# Sistema de Autenticação

O sistema de autenticação da API segue um modelo de segurança em duas camadas:

1. **Chaves de API** (CI/CS) para autenticar aplicações cliente
2. **Tokens JWT** para autenticar usuários nas rotas protegidas

## 1. Autenticação de Aplicações Cliente (CI/CS)

Antes que um usuário possa se registrar ou fazer login, a aplicação cliente (frontend, app mobile, etc.) precisa se autenticar usando um par de chaves de API:

- **Client Identifier (CI)**: identificador único da aplicação cliente
- **Client Secret (CS)**: chave secreta da aplicação cliente

Estas chaves são geradas e fornecidas pelo administrador do sistema e devem ser mantidas em segurança.

### Como obter chaves de API

As chaves de API são geradas apenas pelo administrador do sistema através da rota `/api/admin/clients/api-keys`. Estas chaves são armazenadas na tabela `admin.access_tokens`.

### Como usar as chaves de API

As chaves de API devem ser incluídas nos headers de todas as requisições para rotas públicas:

```
X-Client-ID: {seu_client_id}
X-Client-Secret: {seu_client_secret}
```

### Rotas que exigem autenticação por CI/CS

- POST `/api/auth/login`: Autenticação de usuários
- POST `/api/users`: Registro de novos usuários

## 2. Autenticação de Usuários (JWT)

Após o usuário fazer login com sucesso, a API retorna um token JWT (JSON Web Token) que deve ser usado para acessar rotas protegidas.

### Como obter o token JWT

O token JWT é obtido ao fazer login através da rota `/api/auth/login`. É necessário fornecer as chaves de API (CI/CS) nos headers da requisição e um JSON com email e senha no corpo:

```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

A resposta incluirá:

```json
{
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@example.com",
    "role_id": 2,
    "created_at": "2025-04-07T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Como usar o token JWT

O token JWT deve ser incluído no header `Authorization` de todas as requisições para rotas protegidas, usando o formato Bearer:

```
Authorization: Bearer {seu_token_jwt}
```

### Tempo de expiração do token

Por padrão, o token JWT expira após 1 hora. Se o parâmetro `rememberMe` for enviado como `true` no login, o token expirará após 7 dias.

## 3. Sistema de Roles (Funções)

O sistema possui um mecanismo de controle de acesso baseado em roles. Cada usuário possui uma role associada:

| role_id | Nome  | Descrição               |
|---------|-------|-------------------------|
| 1       | admin | Administrador do sistema|
| 2       | user  | Usuário comum           |

### Atribuição de Roles

- Ao se registrar, um usuário recebe automaticamente a role "user" (role_id = 2)
- A alteração de role só pode ser feita por um administrador

### Middleware de Verificação de Roles

O middleware `checkRole` verifica se o usuário tem permissão para acessar determinadas rotas. Por exemplo, a rota `/api/users/admin` só pode ser acessada por usuários com a role "admin".

## 4. Diagrama de Fluxo de Autenticação

```
+-------------------+     CI/CS     +-------------+     Credenciais    +-------------+
| Aplicação Cliente |  ---------->  |    API      |  ---------------->  | Banco de    |
|    (Frontend)     |               | (Middleware)|                     |   Dados     |
+-------------------+               +-------------+                     +-------------+
         |                                 |                                   |
         |                                 |       Verifica Credenciais       |
         |                                 | <------------------------------ |
         |                                 |                                   |
         |                 JWT             |                                   |
         | <------------------------------- |                                   |
         |                                 |                                   |
         |    JWT (Rotas Protegidas)      |                                   |
         | -----------------------------> |                                   |
         |                                 |       Verifica JWT               |
         |                                 | ----------------------------> |
         |                                 |                                   |
         |       Resposta Protegida       |                                   |
         | <------------------------------- |                                   |
```

## 5. Exemplos de Uso

### Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "X-Client-ID: seu_client_id" \
  -H "X-Client-Secret: seu_client_secret" \
  -d '{"name": "Novo Usuário", "email": "novo@example.com", "password": "senha123"}'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Client-ID: seu_client_id" \
  -H "X-Client-Secret: seu_client_secret" \
  -d '{"email": "novo@example.com", "password": "senha123", "rememberMe": false}'
```

### Acessar uma rota protegida

```bash
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer seu_token_jwt"
```

## 6. Tabelas do Banco de Dados

### access_tokens

Armazena as chaves de API (CI/CS) para autenticação das aplicações cliente.

| Coluna    | Tipo      | Descrição                           |
|-----------|-----------|-------------------------------------|
| id        | SERIAL    | ID primário                         |
| ci        | VARCHAR   | Client Identifier                   |
| cs        | VARCHAR   | Client Secret                       |
| agent     | VARCHAR   | Agente que gerou o token            |
| created_at| TIMESTAMP | Data de criação                     |
| updated_at| TIMESTAMP | Data de atualização                 |

### user_roles

Armazena as roles disponíveis no sistema.

| Coluna     | Tipo      | Descrição                           |
|------------|-----------|-------------------------------------|
| id         | SERIAL    | ID primário                         |
| name       | VARCHAR   | Nome da role                        |
| description| TEXT      | Descrição da role                   |
| created_at | TIMESTAMP | Data de criação                     |
| updated_at | TIMESTAMP | Data de atualização                 |

### users

Armazena os dados dos usuários.

| Coluna     | Tipo      | Descrição                           |
|------------|-----------|-------------------------------------|
| id         | SERIAL    | ID primário                         |
| name       | VARCHAR   | Nome do usuário                     |
| email      | VARCHAR   | Email do usuário (único)            |
| password   | VARCHAR   | Senha criptografada com bcrypt      |
| role_id    | INTEGER   | ID da role (referencia user_roles)  |
| created_at | TIMESTAMP | Data de criação                     |
| updated_at | TIMESTAMP | Data de atualização                 |

## 7. Segurança

- Senhas são criptografadas com bcrypt antes de serem armazenadas
- Tokens JWT são assinados com uma chave secreta definida em `JWT_SECRET`
- As chaves de API (CI/CS) devem ser mantidas em segredo e nunca expostas publicamente
- O middleware `clientAuth` verifica a presença e validade das chaves de API em todas as requisições públicas
- O middleware `jwtAuth` verifica a presença e validade do token JWT em todas as requisições protegidas
- O middleware `checkRole` verifica se o usuário tem a role necessária para acessar determinadas rotas 