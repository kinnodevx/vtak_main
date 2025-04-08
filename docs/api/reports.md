# Documentação da API de Relatórios

## Autenticação

Todas as rotas requerem autenticação JWT. O token deve ser enviado no header `Authorization` no formato:
```
Authorization: Bearer <seu_token_jwt>
```

## Upload de Relatórios

### POST /api/reports/upload

Upload de um arquivo ZIP contendo relatórios.

#### Headers
- `Authorization`: Token JWT
- `Content-Type`: multipart/form-data

#### Parâmetros
- `report`: Arquivo ZIP (obrigatório)

#### Exemplo de Requisição
```bash
curl -X POST http://localhost:3000/api/reports/upload \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: multipart/form-data" \
  -F "report=@/caminho/para/seu/arquivo.zip"
```

#### Resposta de Sucesso (200)
```json
{
  "message": "Relatório processado com sucesso",
  "report": {
    "id": 1,
    "directory": "relatory_1234567890",
    "created_at": "2025-04-08T18:15:05.584Z"
  }
}
```

#### Resposta de Erro (400)
```json
{
  "error": "O arquivo ZIP não pôde ser processado"
}
```

## Listagem de Relatórios

### GET /api/reports/directories

Lista todos os diretórios de relatórios e seus arquivos.

#### Headers
- `Authorization`: Token JWT

#### Exemplo de Requisição
```bash
curl -X GET http://localhost:3000/api/reports/directories \
  -H "Authorization: Bearer <seu_token_jwt>"
```

#### Resposta de Sucesso (200)
```json
{
  "base_directory": "relatories",
  "directories": [
    {
      "name": "relatory_1234567890",
      "path": "relatory_1234567890",
      "created": "2025-04-08T18:15:05.584Z",
      "modified": "2025-04-08T18:15:06.845Z",
      "files": [
        {
          "name": "Relatorio - Capag.xlsx",
          "size": 10197,
          "type": "xlsx",
          "created": "2025-04-08T18:15:05.584Z",
          "modified": "2025-03-31T20:34:56.000Z"
        }
      ]
    }
  ]
}
```

### GET /api/reports/files/:reportDir

Lista os arquivos de um diretório específico.

#### Headers
- `Authorization`: Token JWT

#### Parâmetros da URL
- `reportDir`: Nome do diretório do relatório

#### Exemplo de Requisição
```bash
curl -X GET http://localhost:3000/api/reports/files/relatory_1234567890 \
  -H "Authorization: Bearer <seu_token_jwt>"
```

#### Resposta de Sucesso (200)
```json
{
  "files": [
    {
      "name": "Relatorio - Capag.xlsx",
      "size": 10197,
      "type": "xlsx",
      "created": "2025-04-08T18:15:05.584Z",
      "modified": "2025-03-31T20:34:56.000Z"
    }
  ]
}
```

### GET /api/reports/file/:reportDir/:fileName

Download de um arquivo específico.

#### Headers
- `Authorization`: Token JWT

#### Parâmetros da URL
- `reportDir`: Nome do diretório do relatório
- `fileName`: Nome do arquivo

#### Exemplo de Requisição
```bash
curl -X GET http://localhost:3000/api/reports/file/relatory_1234567890/Relatorio%20-%20Capag.xlsx \
  -H "Authorization: Bearer <seu_token_jwt>" \
  --output relatorio.xlsx
```

#### Resposta de Sucesso (200)
- Arquivo binário do relatório

#### Resposta de Erro (404)
```json
{
  "error": "Arquivo não encontrado"
}
```

## Códigos de Erro

- `400`: Requisição inválida
- `401`: Não autorizado (token JWT inválido ou expirado)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor 