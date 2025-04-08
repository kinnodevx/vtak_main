# VTAK - Sistema de Gestão de Relatórios

Este é o backend do sistema VTAK, responsável por gerenciar o upload e processamento de relatórios.

## Funcionalidades

- Upload de arquivos ZIP contendo relatórios
- Extração automática dos arquivos
- Validação dos arquivos obrigatórios
- Autenticação via JWT
- Controle de acesso baseado em roles
- API RESTful

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/vtak_main.git
cd vtak_main
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicialize o banco de dados:
```bash
npm run init-db
```

5. Inicie o servidor:
```bash
npm run dev
```

## Estrutura do Projeto

O projeto segue a arquitetura hexagonal (ports and adapters):

```
src/
  ├── application/        # Casos de uso da aplicação
  ├── domain/            # Regras de negócio e entidades
  ├── infrastructure/    # Implementações concretas (banco de dados, etc)
  └── interfaces/        # Controllers, rotas e middlewares
```

## API

### Autenticação

Para acessar as rotas protegidas, é necessário:

1. Ter um par de chaves de API (CI/CS)
2. Fazer login para obter um token JWT
3. Incluir o token JWT no header `Authorization`

### Rotas

- `POST /api/auth/login`: Login de usuário
- `POST /api/reports/upload`: Upload de relatório
- `GET /api/reports`: Listar relatórios
- `GET /api/reports/files/:reportDir`: Listar arquivos de um relatório
- `GET /api/reports/file/:reportDir/:fileName`: Download de arquivo

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. 