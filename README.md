# Backend com Arquitetura Hexagonal

Este projeto implementa um backend em Node.js utilizando a Arquitetura Hexagonal (também conhecida como Ports and Adapters). A arquitetura hexagonal é uma abordagem que separa a lógica de negócio da infraestrutura, tornando o sistema mais flexível e testável.

## Estrutura do Projeto

```
src/
├── application/     # Casos de uso e regras de negócio
├── domain/         # Entidades e regras de domínio
├── infrastructure/ # Implementações concretas
├── interfaces/     # Controladores e rotas
└── shared/         # Utilitários e configurações
```

## Camadas da Arquitetura

### 1. Domain Layer (src/domain/)

A camada de domínio contém as entidades e regras de negócio puros. É o coração da aplicação e não deve depender de nenhuma outra camada.

#### Exemplo: Entidade User
```javascript
class User {
  constructor({ id, name, email, password }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.name || !this.email || !this.password) {
      throw new Error('Dados do usuário inválidos');
    }
  }
}
```

### 2. Application Layer (src/application/)

Contém os casos de uso da aplicação. Esta camada implementa as regras de negócio e coordena as operações entre as entidades.

#### Exemplo: Caso de Uso CreateUser
```javascript
class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const user = new User(userData);
    user.validate();
    
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    return this.userRepository.save(user);
  }
}
```

### 3. Interfaces Layer (src/interfaces/)

Responsável por expor a aplicação para o mundo externo. Pode ser através de APIs REST, GraphQL, CLI, etc.

#### Controladores
```javascript
class UserController {
  constructor(createUser) {
    this.createUser = createUser;
  }

  async create(req, res) {
    try {
      const user = await this.createUser.execute(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
```

#### Rotas
```javascript
const router = Router();

module.exports = (createUser) => {
  const userController = new UserController(createUser);
  router.post('/', userController.create.bind(userController));
  return router;
};
```

### 4. Infrastructure Layer (src/infrastructure/)

Implementa as interfaces definidas na camada de domínio. Pode incluir:
- Repositórios de banco de dados
- Serviços externos
- Cache
- Mensageria

## Fluxo de Dados

1. **Requisição HTTP** chega ao servidor
2. **Router** direciona para o controlador apropriado
3. **Controller** recebe os dados e chama o caso de uso
4. **Use Case** coordena a operação usando a entidade
5. **Entity** valida os dados e aplica regras de negócio
6. **Repository** persiste os dados
7. **Response** é retornada ao cliente

## Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`

3. Inicie o servidor:
```bash
npm run dev
```

## Endpoints Disponíveis

### Usuários
- `POST /api/users` - Cria um novo usuário
  ```json
  {
    "name": "Nome do Usuário",
    "email": "email@exemplo.com",
    "password": "senha123"
  }
  ```

## Boas Práticas

1. **Separação de Responsabilidades**
   - Cada camada tem uma responsabilidade específica
   - As dependências sempre apontam para dentro (domínio)

2. **Testabilidade**
   - Facilita a criação de testes unitários
   - Permite mockar facilmente as dependências externas

3. **Manutenibilidade**
   - Código organizado e previsível
   - Facilita a adição de novas funcionalidades

4. **Flexibilidade**
   - Fácil trocar implementações (ex: banco de dados)
   - Adaptável a diferentes interfaces (REST, GraphQL, etc.)

## Próximos Passos

1. Implementar autenticação
2. Adicionar validações mais robustas
3. Implementar testes unitários e de integração
4. Adicionar logging e monitoramento
5. Configurar CI/CD

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 