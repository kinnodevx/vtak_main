const express = require('express');
const router = express.Router();
const jwtAuthMiddleware = require('../middleware/jwtAuth');
const checkRole = require('../middleware/checkRole');

module.exports = (userController) => {
  // Rota pública para criar usuário
  router.post('/', userController.create.bind(userController));

  // Rotas protegidas por autenticação
  router.use(jwtAuthMiddleware);

  // Rotas que requerem role de admin
  router.get('/admin', checkRole(['admin']), (req, res) => {
    res.json({ message: 'Acesso permitido apenas para administradores' });
  });

  return router;
}; 