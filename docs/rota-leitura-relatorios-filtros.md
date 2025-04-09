# Rota de Leitura de Relatórios com Filtros

## Descrição
Esta rota permite a leitura de dados de relatórios com diversos filtros opcionais. Os dados são retornados em formato JSON, ordenados por data de emissão em ordem decrescente, com suporte a paginação.

## Endpoint
```
GET /api/reports/relatories
```

## Parâmetros de Consulta (Query Parameters)

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| reportDir | string | Não | Nome do diretório para verificar existência do arquivo |
| limit | number | Não | Limita o número de registros por página (padrão: 10) |
| page | number | Não | Número da página atual (padrão: 1) |
| emission_date | string | Não | Filtra por data de emissão específica (formato: YYYY-MM-DD) |
| date_cession | string | Não | Filtra por data de cessão específica (formato: YYYY-MM-DD) |
| emission_date_start | string | Não | Início do intervalo de datas de emissão (formato: YYYY-MM-DD) |
| emission_date_end | string | Não | Fim do intervalo de datas de emissão (formato: YYYY-MM-DD) |
| date_cession_start | string | Não | Início do intervalo de datas de cessão (formato: YYYY-MM-DD) |
| date_cession_end | string | Não | Fim do intervalo de datas de cessão (formato: YYYY-MM-DD) |

## Exemplos de Uso

### 1. Leitura de Todos os Registros (Primeira Página)
```bash
curl -X GET "http://localhost:3000/api/reports/relatories" | jq
```

### 2. Limitar Número de Registros por Página
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?limit=10" | jq
```

### 3. Navegar para Página Específica
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?page=2" | jq
```

### 4. Filtrar por Data de Emissão
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?emission_date=2025-03-13" | jq
```

### 5. Filtrar por Intervalo de Datas de Emissão
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?emission_date_start=2025-03-13&emission_date_end=2025-03-20" | jq
```

### 6. Combinar Múltiplos Filtros com Paginação
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?emission_date_start=2025-03-13&emission_date_end=2025-03-20&date_cession_start=2025-03-17&date_cession_end=2025-03-24&limit=5&page=2" | jq
```

## Formato da Resposta

### Sucesso (200 OK)
```json
{
  "success": true,
  "file": {
    "name": "Relatorio - Produção.xlsx",
    "size": 1234567,
    "created": "2025-03-13T03:00:00.000Z",
    "modified": "2025-03-13T03:00:00.000Z"
  },
  "data": [
    {
      "emission_date": "2025-03-13T03:00:00.000Z",
      "date_cession": "2025-03-17T03:00:00.000Z",
      "cpf_bancarizador_endossante": "34.337.707/0001-00",
      "n_contract": "000"
    }
  ],
  "pagination": {
    "total": 100,
    "totalPages": 10,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Erro (500 Internal Server Error)
```json
{
  "error": "Erro interno ao ler relatórios",
  "details": "Mensagem de erro específica"
}
```

## Notas Adicionais

1. As datas são retornadas no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
2. O campo `file` só é retornado quando o parâmetro `reportDir` é fornecido
3. A paginação é automática e retorna 10 registros por página por padrão
4. O campo `pagination` contém informações sobre:
   - `total`: Número total de registros
   - `totalPages`: Número total de páginas
   - `currentPage`: Página atual
   - `itemsPerPage`: Número de itens por página
   - `hasNextPage`: Indica se existe próxima página
   - `hasPreviousPage`: Indica se existe página anterior
5. Os registros são sempre ordenados por data de emissão em ordem decrescente
6. Todos os parâmetros de consulta são opcionais 