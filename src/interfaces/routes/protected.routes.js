const { Router } = require('express');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

const router = Router();

// Aplica o middleware JWT em todas as rotas
router.use(jwtAuthMiddleware);

// Rota protegida que retorna os dados do usuário
router.get('/profile', (req, res) => {
  return res.json({
    message: 'Rota protegida acessada com sucesso',
    user: {
      id: req.userId,
      email: req.userEmail
    }
  });
});

module.exports = router; 