# Documentação das Rotas de Relatórios

Esta documentação descreve as rotas para upload e gerenciamento de arquivos de relatórios.

## 1. Upload de Relatório

**Endpoint:** `POST /api/reports/upload`

**Descrição:** Permite o upload de um arquivo ZIP contendo relatórios específicos. O arquivo será extraído para uma pasta dedicada. Este endpoint é protegido e requer autenticação com token JWT.

**Headers necessários:**
```
Authorization: Bearer {seu_token_jwt}
```

**Parâmetros do formulário:**
- `report`: Arquivo ZIP que contém os relatórios obrigatórios

**Arquivos obrigatórios no ZIP:**
- `Relatorio - Capag.xlsx`
- `Relatorio de estoque.xlsx`
- `Relatorio Liquidados.xlt`
- `Relatorio - Produção.xlsx`

**Resposta de sucesso (201):**
```json
{
  "message": "Relatório enviado e processado com sucesso",
  "id": 5,
  "directoryName": "relatory_05",
  "fileSize": 730,
  "fileSizeFormatted": "0.00 MB",
  "uploadDate": "2025-04-07T19:09:00.650Z",
  "uploadedBy": 10,
  "files": [
    "Relatorio - Capag.xlsx",
    "Relatorio de estoque.xlsx",
    "Relatorio Liquidados.xlt",
    "Relatorio - Produção.xlsx"
  ]
}
```

**Possíveis erros:**
- 400: Nenhum arquivo enviado
- 400: O arquivo deve ser do tipo ZIP
- 400: Arquivos obrigatórios não encontrados no ZIP
- 401: Token não fornecido ou inválido
- 500: Erro ao processar o relatório

## 2. Listar Relatórios

**Endpoint:** `GET /api/reports`

**Descrição:** Lista todos os relatórios enviados anteriormente. Este endpoint é protegido e requer autenticação com token JWT.

**Headers necessários:**
```
Authorization: Bearer {seu_token_jwt}
```

**Resposta de sucesso (200):**
```json
{
  "reports": [
    {
      "id": 4,
      "name": "relatory_03",
      "fileSize": "0",
      "fileSizeFormatted": "0.00 MB",
      "uploadDate": "2025-04-07T19:08:37.939Z",
      "syncDate": null,
      "uploadedBy": 10,
      "files": [
        "Relatorio - Capag.xlsx",
        "Relatorio de estoque.xlsx",
        "Relatorio Liquidados.xlt",
        "Relatorio - Produção.xlsx"
      ]
    }
  ],
  "stats": {
    "totalReports": 4,
    "totalSizeBytes": 181507580,
    "totalSizeFormatted": "173.10 MB"
  }
}
```

**Possíveis erros:**
- 401: Token não fornecido ou inválido
- 500: Erro ao listar relatórios

## 3. Listar Arquivos de um Relatório

**Endpoint:** `GET /api/reports/files/{nome_do_diretorio}`

**Descrição:** Lista todos os arquivos de um relatório específico, incluindo informações detalhadas e URLs para download. Esta rota é pública e não requer autenticação.

**Parâmetros de URL:**
- `nome_do_diretorio`: Nome do diretório do relatório (ex: relatory_01)

**Resposta de sucesso (200):**
```json
{
  "reportDir": "relatory_01",
  "totalFiles": 4,
  "files": [
    {
      "name": "Relatorio - Capag.xlsx",
      "size": 10197,
      "sizeFormatted": "0.01 MB",
      "extension": ".xlsx",
      "lastModified": "2025-04-07T20:19:00.094Z",
      "url": "http://localhost:3000/api/reports/file/relatory_01/Relatorio - Capag.xlsx"
    },
    {
      "name": "Relatorio - Produção.xlsx",
      "size": 6661570,
      "sizeFormatted": "6.35 MB",
      "extension": ".xlsx",
      "lastModified": "2025-04-07T20:19:02.079Z",
      "url": "http://localhost:3000/api/reports/file/relatory_01/Relatorio - Produção.xlsx"
    }
    // ... outros arquivos
  ]
}
```

**Possíveis erros:**
- 404: Diretório do relatório não encontrado
- 500: Erro ao listar arquivos do relatório

## 4. Baixar um Arquivo Específico

**Endpoint:** `GET /api/reports/file/{nome_do_diretorio}/{nome_do_arquivo}`

**Descrição:** Permite baixar um arquivo específico de um relatório. Esta rota é pública e não requer autenticação.

**Parâmetros de URL:**
- `nome_do_diretorio`: Nome do diretório do relatório (ex: relatory_01)
- `nome_do_arquivo`: Nome do arquivo, incluindo a extensão (ex: Relatorio - Capag.xlsx)

**Resposta de sucesso:**
- Streaming do arquivo solicitado com os headers de download apropriados

**Possíveis erros:**
- 400: Diretório do relatório e nome do arquivo são obrigatórios
- 404: Diretório do relatório não encontrado
- 404: Arquivo não encontrado
- 500: Erro ao acessar arquivo de relatório

## 5. Extrair Dados de Coluna

**Endpoint:** `GET /api/reports/extract/{nome_do_diretorio}/{coluna?}/{linha_inicial?}`

**Descrição:** Extrai dados de uma coluna específica a partir de uma linha inicial em todos os arquivos Excel de um relatório. Este endpoint é protegido e requer autenticação com token JWT.

**Headers necessários:**
```
Authorization: Bearer {seu_token_jwt}
```

**Parâmetros de URL:**
- `nome_do_diretorio`: Nome do diretório do relatório (ex: relatory_01)
- `coluna`: (Opcional) Letra da coluna a ser extraída (ex: L). Padrão: L
- `linha_inicial`: (Opcional) Número da linha inicial (base-1). Padrão: 3

**Resposta de sucesso (200):**
```json
{
  "reportDir": "relatory_01",
  "column": "L",
  "startRow": 3,
  "files": {
    "Relatorio - Capag.xlsx": {
      "total": 52,
      "data": ["Valor1", "Valor2", "Valor3", ...]
    },
    "Relatorio - Produção.xlsx": {
      "total": 124,
      "data": ["Valor1", "Valor2", "Valor3", ...]
    }
  }
}
```

**Possíveis erros:**
- 400: Diretório do relatório é obrigatório
- 401: Token não fornecido ou inválido
- 404: Diretório do relatório não encontrado
- 404: Nenhum arquivo Excel encontrado no relatório
- 500: Erro ao extrair dados da coluna

## 6. Exemplo de uso com curl

### Upload de Relatório
```bash
curl -X POST http://localhost:3000/api/reports/upload \
  -H "Authorization: Bearer seu_token_jwt" \
  -F "report=@/caminho/para/seu/arquivo.zip" \
  -v
```

### Listar Relatórios
```bash
curl -X GET http://localhost:3000/api/reports \
  -H "Authorization: Bearer seu_token_jwt"
```

### Listar Arquivos de um Relatório
```bash
curl -X GET http://localhost:3000/api/reports/files/relatory_01 | jq
```

### Baixar um Arquivo Específico
```bash
curl -o relatorio_capag.xlsx http://localhost:3000/api/reports/file/relatory_01/Relatorio%20-%20Capag.xlsx
```

### Extrair Dados de Coluna
```bash
curl -X GET http://localhost:3000/api/reports/extract/relatory_01/L/3 \
  -H "Authorization: Bearer seu_token_jwt" | jq
```

## 7. Considerações Importantes

- O sistema aceita apenas arquivos ZIP, com tamanho máximo de 2 GB.
- Todos os arquivos obrigatórios devem estar na raiz do arquivo ZIP.
- Os diretórios de relatório são nomeados sequencialmente (relatory_01, relatory_02, etc.).
- As rotas de upload e listagem geral são protegidas e exigem um token JWT válido, obtido através do endpoint de login.
- As rotas de acesso a arquivos específicos são públicas para facilitar a integração com outros sistemas.
- Os arquivos podem ser acessados diretamente pelo URL fornecido na resposta da rota de listagem de arquivos. 