class AuthController {
  constructor(authenticateUser) {
    this.authenticateUser = authenticateUser;
  }

  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      const result = await this.authenticateUser.execute(email, password, userAgent, rememberMe);
      
      return res.json(result);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
        return res.status(401).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = AuthController; 