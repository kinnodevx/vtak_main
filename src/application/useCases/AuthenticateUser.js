const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthenticateUser {
  constructor(userRepository, accessTokenRepository) {
    this.userRepository = userRepository;
    this.accessTokenRepository = accessTokenRepository;
  }

  async execute(email, password, userAgent, rememberMe = false) {
    try {
      // Buscar o usuário pelo email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email ou senha inválidos');
      }

      // Gerar o token JWT usando o ID do usuário, sem gerar novo CI e CS
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role_id: user.role_id
        }, 
        process.env.JWT_SECRET || 'sua_chave_secreta',
        { expiresIn: rememberMe ? '7d' : '1h' }
      );

      // Remover a senha do objeto retornado
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        created_at: user.created_at
      };
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }
}

module.exports = AuthenticateUser; 