class UserController {
  constructor(createUser) {
    this.createUser = createUser;
  }

  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      // Criar o usuário
      const user = await this.createUser.execute({ name, email, password });
      
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController; 