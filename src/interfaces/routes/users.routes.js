const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

module.exports = (createUser) => {
  const userController = new UserController(createUser);
  
  router.post('/', userController.create.bind(userController));
  
  return router;
}; 