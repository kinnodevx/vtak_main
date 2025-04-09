const express = require('express');
const router = express.Router();
const jwtAuthMiddleware = require('../middleware/jwtAuth');
const checkRole = require('../middleware/checkRole');

module.exports = (clientController) => {
  // Todas as rotas abaixo exigem autenticação JWT
  router.use(jwtAuthMiddleware);
  
  // Todas as rotas abaixo exigem permissão de administrador
  router.use(checkRole(['admin']));
  
  // Rota para gerar novas chaves de API (apenas administradores)
  router.post('/api-keys', clientController.registerClient.bind(clientController));
  
  // Rota para listar todas as chaves de API (apenas administradores)
  router.get('/api-keys', clientController.listClients.bind(clientController));
  
  // Rota para revogar uma chave de API (apenas administradores)
  router.delete('/api-keys/:clientId', clientController.deleteClient.bind(clientController));

  return router;
}; 