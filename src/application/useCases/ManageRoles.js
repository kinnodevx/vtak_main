class ManageRoles {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async createRole(roleData) {
    try {
      const existingRole = await this.roleRepository.findByName(roleData.name);
      if (existingRole) {
        throw new Error('Role já existe com este nome');
      }

      return await this.roleRepository.create(roleData);
    } catch (error) {
      throw new Error(`Erro ao criar role: ${error.message}`);
    }
  }

  async updateRole(id, roleData) {
    try {
      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) {
        throw new Error('Role não encontrada');
      }

      return await this.roleRepository.update(id, roleData);
    } catch (error) {
      throw new Error(`Erro ao atualizar role: ${error.message}`);
    }
  }

  async deleteRole(id) {
    try {
      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) {
        throw new Error('Role não encontrada');
      }

      await this.roleRepository.delete(id);
      return { message: 'Role deletada com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar role: ${error.message}`);
    }
  }

  async assignRoleToUser(userId, roleId) {
    try {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw new Error('Role não encontrada');
      }

      return await this.roleRepository.assignRoleToUser(userId, roleId);
    } catch (error) {
      throw new Error(`Erro ao atribuir role ao usuário: ${error.message}`);
    }
  }

  async getUserRole(userId) {
    try {
      const role = await this.roleRepository.getUserRole(userId);
      if (!role) {
        throw new Error('Usuário não possui role atribuída');
      }

      return role;
    } catch (error) {
      throw new Error(`Erro ao buscar role do usuário: ${error.message}`);
    }
  }

  async listRoles() {
    try {
      return await this.roleRepository.findAll();
    } catch (error) {
      throw new Error(`Erro ao listar roles: ${error.message}`);
    }
  }
}

module.exports = ManageRoles; 