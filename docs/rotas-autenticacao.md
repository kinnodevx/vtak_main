# Documentação das Rotas de Autenticação

## 1. Registro de Usuário

**Endpoint:** `POST /api/users`

**Descrição:** Cria um novo usuário no sistema. O usuário criado recebe automaticamente a role "user" (role_id = 2).

**Headers necessários:**
```
Content-Type: application/json
X-Client-ID: {seu_client_id}
X-Client-Secret: {seu_client_secret}
```

**Corpo da requisição:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de sucesso (201):**
```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "role_id": 2,
  "created_at": "2023-04-07T12:00:00.000Z"
}
```

**Possíveis erros:**
- 400: Dados inválidos (ex: nome, email ou senha não fornecidos)
- 400: Email já está em uso
- 401: Chaves de API não fornecidas ou inválidas
- 500: Erro interno do servidor

## 2. Login

**Endpoint:** `POST /api/auth/login`

**Descrição:** Autentica um usuário e retorna um token JWT.

**Headers necessários:**
```
Content-Type: application/json
X-Client-ID: {seu_client_id}
X-Client-Secret: {seu_client_secret}
```

**Corpo da requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "rememberMe": false
}
```

* O campo `rememberMe` é opcional. Se definido como `true`, o token JWT expirará após 7 dias. Se `false` ou não fornecido, expirará após 1 hora.

**Resposta de sucesso (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role_id": 2,
    "created_at": "2023-04-07T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis erros:**
- 400: Email e senha são obrigatórios
- 401: Email ou senha inválidos
- 401: Chaves de API não fornecidas ou inválidas
- 500: Erro interno do servidor

## 3. Como usar o token JWT

Após obter o token JWT através do login, você deve incluí-lo no header `Authorization` de todas as requisições para rotas protegidas, usando o formato Bearer:

```
Authorization: Bearer {seu_token_jwt}
```

O token contém informações sobre o usuário, incluindo seu ID, email e role_id. Estas informações são usadas pelo servidor para identificar o usuário e verificar suas permissões.

## 4. Exemplo de uso com curl

### Registrar um novo usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "X-Client-ID: seu_client_id" \
  -H "X-Client-Secret: seu_client_secret" \
  -d '{"name": "Novo Usuário", "email": "novo@exemplo.com", "password": "senha123"}'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Client-ID: seu_client_id" \
  -H "X-Client-Secret: seu_client_secret" \
  -d '{"email": "novo@exemplo.com", "password": "senha123", "rememberMe": false}'
```

### Acessar uma rota protegida
```bash
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer seu_token_jwt"
``` 