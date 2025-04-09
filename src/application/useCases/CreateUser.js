const User = require('../../domain/entities/User');
const bcrypt = require('bcrypt');

class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    try {
      // Verificar se o email já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Criptografar a senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Definir role_id como 2 (usuário comum) por padrão
      const userToCreate = {
        ...userData,
        password: hashedPassword,
        role_id: 2 // role_id 2 é o usuário comum
      };

      // Criar o usuário
      const user = await this.userRepository.create(userToCreate);
      
      // Remover a senha do objeto retornado
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }
}

module.exports = CreateUser; 