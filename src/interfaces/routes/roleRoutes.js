const express = require('express');
const router = express.Router();
const jwtAuthMiddleware = require('../middleware/jwtAuth');

module.exports = (roleController) => {
  // Rotas protegidas por autenticação
  router.use(jwtAuthMiddleware);

  // Criar uma nova role
  router.post('/', roleController.createRole.bind(roleController));

  // Atualizar uma role existente
  router.put('/:id', roleController.updateRole.bind(roleController));

  // Deletar uma role
  router.delete('/:id', roleController.deleteRole.bind(roleController));

  // Atribuir uma role a um usuário
  router.post('/assign', roleController.assignRoleToUser.bind(roleController));

  // Obter a role de um usuário
  router.get('/user/:userId', roleController.getUserRole.bind(roleController));

  // Listar todas as roles
  router.get('/', roleController.listRoles.bind(roleController));

  return router;
}; 