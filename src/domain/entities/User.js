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

module.exports = User; 