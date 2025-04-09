const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const router = Router();

module.exports = (authenticateUser) => {
  const authController = new AuthController(authenticateUser);
  
  router.post('/login', authController.login.bind(authController));
  
  return router;
}; 