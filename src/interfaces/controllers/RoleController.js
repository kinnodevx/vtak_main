class RoleController {
  constructor(manageRoles) {
    this.manageRoles = manageRoles;
  }

  async createRole(req, res) {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome da role é obrigatório' });
      }

      const role = await this.manageRoles.createRole({ name, description });
      return res.status(201).json(role);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome da role é obrigatório' });
      }

      const role = await this.manageRoles.updateRole(id, { name, description });
      return res.json(role);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await this.manageRoles.deleteRole(id);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async assignRoleToUser(req, res) {
    try {
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        return res.status(400).json({ error: 'ID do usuário e ID da role são obrigatórios' });
      }

      const result = await this.manageRoles.assignRoleToUser(userId, roleId);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getUserRole(req, res) {
    try {
      const { userId } = req.params;
      const role = await this.manageRoles.getUserRole(userId);
      return res.json(role);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listRoles(req, res) {
    try {
      const roles = await this.manageRoles.listRoles();
      return res.json(roles);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = RoleController; 