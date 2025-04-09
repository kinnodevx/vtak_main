const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/UploadController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para upload de arquivo
router.post('/upload', 
    authMiddleware.authenticate,
    uploadMiddleware.single('file'),
    uploadController.upload
);

// Rota para listar todos os uploads
router.get('/uploads',
    authMiddleware.authenticate,
    uploadController.getAllUploads
);

// Rota para buscar upload por ID
router.get('/uploads/:id',
    authMiddleware.authenticate,
    uploadController.getUploadById
);

// Rota para buscar upload por nome do diretório
router.get('/uploads/directory/:directoryName',
    authMiddleware.authenticate,
    uploadController.getUploadByDirectoryName
);

module.exports = router; 