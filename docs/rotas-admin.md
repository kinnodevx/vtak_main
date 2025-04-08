# Documentação das Rotas Administrativas

Esta documentação descreve as rotas disponíveis para usuários com permissão de administrador (role_id = 1).

## 1. Geração de Chaves de API (CI/CS)

**Endpoint:** `POST /api/admin/clients/api-keys`

**Descrição:** Gera um novo par de chaves Client Identifier (CI) e Client Secret (CS) para autenticação de aplicações cliente. Apenas administradores podem acessar esta rota.

**Headers necessários:**
```
Content-Type: application/json
Authorization: Bearer {seu_token_jwt}
```

**Corpo da requisição:**
```json
{
  "agent": "Nome do Agente que Usará as Chaves"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Chaves de API geradas com sucesso",
  "credentials": {
    "clientId": "api_79d5c55b35fd2ab8b4a92c763ee7e9c9",
    "clientSecret": "secret_406ca25d47cb7960ca1aafd97dedfe9e78745c35daced05823c4fbcd959f0f1b",
    "agent": "Web App Cliente 1",
    "createdAt": "2025-04-07T17:19:36.480Z"
  },
  "instructions": "Forneça estas credenciais para aplicações cliente utilizarem nas requisições de registro e login nos cabeçalhos X-Client-ID e X-Client-Secret"
}
```

**Possíveis erros:**
- 400: Parâmetro agent não fornecido
- 401: Token não fornecido ou inválido
- 403: Usuário não tem permissão de administrador
- 500: Erro interno do servidor

## 2. Listar Chaves de API

**Endpoint:** `GET /api/admin/clients/api-keys`

**Descrição:** Lista todas as chaves de API (CI) registradas no sistema. Por segurança, os CS não são retornados. Apenas administradores podem acessar esta rota.

**Headers necessários:**
```
Authorization: Bearer {seu_token_jwt}
```

**Resposta de sucesso (200):**
```json
[
  {
    "id": 15,
    "clientId": "api_79d5c55b35fd2ab8b4a92c763ee7e9c9",
    "createdAt": "2025-04-07T17:19:36.480Z",
    "updatedAt": "2025-04-07T17:19:36.480Z"
  },
  {
    "id": 14,
    "clientId": "bdca67fa8fa28356cb42be22780b263a4af73cf44cf9d5f36f05c55f74b0340e",
    "createdAt": "2025-04-07T17:03:42.867Z",
    "updatedAt": "2025-04-07T17:03:42.867Z"
  }
]
```

**Possíveis erros:**
- 401: Token não fornecido ou inválido
- 403: Usuário não tem permissão de administrador
- 500: Erro interno do servidor

## 3. Revogar Chave de API

**Endpoint:** `DELETE /api/admin/clients/api-keys/:clientId`

**Descrição:** Revoga (remove) uma chave de API existente com base no seu clientId. Apenas administradores podem acessar esta rota.

**Headers necessários:**
```
Authorization: Bearer {seu_token_jwt}
```

**Resposta de sucesso (200):**
```json
{
  "message": "Chave de API revogada com sucesso"
}
```

**Possíveis erros:**
- 401: Token não fornecido ou inválido
- 403: Usuário não tem permissão de administrador
- 500: Erro interno do servidor

## 4. Exemplo de uso com curl

### Gerar novas chaves de API
```bash
curl -X POST http://localhost:3000/api/admin/clients/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{"agent": "Nome da Aplicação Cliente"}'
```

### Listar todas as chaves de API
```bash
curl -X GET http://localhost:3000/api/admin/clients/api-keys \
  -H "Authorization: Bearer seu_token_jwt"
```

### Revogar uma chave de API
```bash
curl -X DELETE http://localhost:3000/api/admin/clients/api-keys/api_79d5c55b35fd2ab8b4a92c763ee7e9c9 \
  -H "Authorization: Bearer seu_token_jwt"
``` 