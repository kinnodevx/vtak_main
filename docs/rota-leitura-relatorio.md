# Rota de Leitura do Relatório de Produção

Esta documentação descreve como utilizar a rota para ler e processar o arquivo "Relatorio - Produção.xlsx".

## Descrição

A rota `/api/reports/read-production/:reportDir` é responsável por:

1. Ler o arquivo "Relatorio - Produção.xlsx" de um diretório específico
2. Extrair as datas das colunas W (Data Digitação) e Y (Data Movimentação)
3. Salvar os dados no banco de dados na tabela `relatories` com os seguintes campos:
   - `emission_date`: Data da coluna W (Data Digitação)
   - `date_cession`: Data da coluna Y (Data Movimentação)
   - `cpf_bancarizador_endossante`: Fixo como '34.337.707/0001-00'
   - `n_contract`: Fixo como '000'

## Pré-requisitos

1. O servidor Node.js deve estar rodando
2. O banco de dados PostgreSQL deve estar configurado e acessível
3. O arquivo "Relatorio - Produção.xlsx" deve estar presente no diretório especificado

## Como Usar

### 1. Listar Diretórios Disponíveis

Primeiro, liste os diretórios disponíveis para encontrar o diretório que contém o relatório:

```bash
curl -X GET http://localhost:3000/api/reports/directories | jq
```

Exemplo de resposta:
```json
{
  "base_directory": "relatories",
  "directories": [
    {
      "name": "relatory_1744225487276",
      "path": "relatory_1744225487276",
      "created": "2025-04-09T19:04:47.283Z",
      "modified": "2025-04-09T19:04:48.531Z",
      "files": [
        {
          "name": "Relatorio - Produção.xlsx",
          "size": 6661570,
          "type": "xlsx",
          "created": "2025-04-09T19:04:48.531Z",
          "modified": "2025-03-31T20:34:56.000Z"
        }
      ]
    }
  ]
}
```

### 2. Ler o Relatório de Produção

Com o nome do diretório em mãos, faça a requisição para ler o relatório:

```bash
curl -X GET http://localhost:3000/api/reports/read-production/relatory_1744225487276 | jq
```

Exemplo de resposta:
```json
{
  "success": true,
  "file": "Relatorio - Produção.xlsx",
  "directory": "relatory_1744225487276",
  "data": {
    "emission_dates": ["2025-02-07", "2025-02-05", ...],
    "date_cessions": ["2025-02-07", "2025-02-05", ...],
    "total_registros": 13066,
    "saved_relatories": 13065
  }
}
```

## Estrutura da Resposta

A resposta da API contém:

- `success`: Indica se a operação foi bem-sucedida
- `file`: Nome do arquivo processado
- `directory`: Nome do diretório onde o arquivo está localizado
- `data`:
  - `emission_dates`: Lista de datas extraídas da coluna W (Data Digitação)
  - `date_cessions`: Lista de datas extraídas da coluna Y (Data Movimentação)
  - `total_registros`: Número total de registros processados
  - `saved_relatories`: Número de registros salvos no banco de dados

## Possíveis Erros

### Diretório não encontrado (404)
```json
{
  "error": "Diretório não encontrado",
  "exists": false
}
```

### Arquivo não encontrado (404)
```json
{
  "error": "Arquivo não encontrado ou erro na leitura",
  "details": "ENOENT: no such file or directory"
}
```

### Erro interno (500)
```json
{
  "error": "Erro interno ao processar relatório",
  "details": "Mensagem de erro específica"
}
```

## Observações

1. As datas são salvas no banco de dados no formato ISO (YYYY-MM-DD)
2. Se uma data de emissão (emission_date) não estiver disponível, será usado o valor da data de cessão (date_cession)
3. O CPF do bancarizador e o número do contrato são valores fixos para todos os registros
4. A rota não requer autenticação 

## Rota de Leitura de Relatórios com Filtros

A rota `/api/reports/relatories` permite ler os dados dos relatórios com diversos filtros.

### Parâmetros de Consulta (Query Parameters)

- `reportDir` (opcional): Nome do diretório específico para verificar a existência do arquivo
- `limit` (opcional): Limita o número de registros retornados
- `emission_date` (opcional): Filtra por uma data específica de emissão (formato: YYYY-MM-DD)
- `date_cession` (opcional): Filtra por uma data específica de cessão (formato: YYYY-MM-DD)
- `emission_date_start` (opcional): Data inicial para filtrar por range de datas de emissão
- `emission_date_end` (opcional): Data final para filtrar por range de datas de emissão
- `date_cession_start` (opcional): Data inicial para filtrar por range de datas de cessão
- `date_cession_end` (opcional): Data final para filtrar por range de datas de cessão

### Exemplos de Uso

1. Ler todos os registros:
```bash
curl -X GET "http://localhost:3000/api/reports/relatories" | jq
```

2. Limitar a 10 registros:
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?limit=10" | jq
```

3. Filtrar por data específica de emissão:
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?emission_date=2025-02-07" | jq
```

4. Filtrar por range de datas de cessão:
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?date_cession_start=2025-02-01&date_cession_end=2025-02-28" | jq
```

5. Combinar múltiplos filtros:
```bash
curl -X GET "http://localhost:3000/api/reports/relatories?emission_date_start=2025-02-01&emission_date_end=2025-02-28&limit=5" | jq
```

### Estrutura da Resposta

```json
{
  "success": true,
  "file": {
    "name": "Relatorio - Produção.xlsx",
    "size": 6661570,
    "created": "2025-04-09T19:04:48.531Z",
    "modified": "2025-03-31T20:34:56.000Z"
  },
  "data": [
    {
      "emission_date": "2025-02-07",
      "date_cession": "2025-02-07",
      "cpf_bancarizador_endossante": "34.337.707/0001-00",
      "n_contract": "000"
    },
    // ... mais registros ...
  ],
  "total": 13065
}
```

### Observações

1. Todos os parâmetros de data devem estar no formato YYYY-MM-DD
2. Os registros são ordenados por data de emissão em ordem decrescente
3. Se nenhum filtro for fornecido, todos os registros serão retornados
4. O campo `file` só será incluído na resposta se um `reportDir` for fornecido
5. A rota não requer autenticação 