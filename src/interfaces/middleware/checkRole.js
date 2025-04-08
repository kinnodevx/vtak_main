const RoleRepository = require('../../infrastructure/repositories/RoleRepository');

const roleRepository = new RoleRepository();

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.role_id;
      
      if (!roleId) {
        return res.status(403).json({ error: 'Usuário não possui role atribuída' });
      }

      // Buscar a role pelo ID
      const role = await roleRepository.findById(roleId);
      
      if (!role) {
        return res.status(403).json({ error: 'Role não encontrada' });
      }

      if (!allowedRoles.includes(role.name)) {
        return res.status(403).json({ error: 'Usuário não tem permissão para acessar este recurso' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissões do usuário' });
    }
  };
};

module.exports = checkRole; 