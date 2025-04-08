const express = require('express');
const router = express.Router();
const UserRepository = require('../../infrastructure/repositories/UserRepository');
const RoleRepository = require('../../infrastructure/repositories/RoleRepository');
const AccessTokenRepository = require('../../infrastructure/repositories/AccessTokenRepository');
const CreateUser = require('../../application/useCases/CreateUser');
const AuthenticateUser = require('../../application/useCases/AuthenticateUser');
const ManageRoles = require('../../application/useCases/ManageRoles');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const RoleController = require('../controllers/RoleController');
const ClientController = require('../controllers/ClientController');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const clientRoutes = require('./clientRoutes');
const reportRoutes = require('./reportRoutes');
const clientAuthMiddleware = require('../middleware/clientAuth');

// Inicialização dos repositórios
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const accessTokenRepository = new AccessTokenRepository();

// Inicialização dos casos de uso
const createUser = new CreateUser(userRepository);
const authenticateUser = new AuthenticateUser(userRepository, accessTokenRepository);
const manageRoles = new ManageRoles(roleRepository);

// Inicialização dos controladores
const userController = new UserController(createUser);
const authController = new AuthController(authenticateUser);
const roleController = new RoleController(manageRoles);
const clientController = new ClientController();

// Rotas de administração de chaves de API (protegidas por JWT)
router.use('/admin/clients', clientRoutes(clientController));

// Rotas públicas que precisam de autenticação via CI/CS (chaves de API)
// Todas as aplicações cliente precisam ter CI/CS válidos para acessar estas rotas
router.post('/auth/login', clientAuthMiddleware, authController.login.bind(authController));
router.post('/users', clientAuthMiddleware, userController.create.bind(userController));

// Rotas protegidas por JWT
// Usuários precisam estar autenticados (ter feito login e possuir um token válido)
router.use('/users', userRoutes(userController));
router.use('/roles', roleRoutes(roleController));
router.use('/reports', reportRoutes());

module.exports = router; 