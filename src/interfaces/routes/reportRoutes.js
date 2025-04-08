const express = require('express');
const router = express.Router();
const { ReportController } = require('../controllers/ReportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

module.exports = () => {
  const reportController = new ReportController();

  // Rotas públicas
  router.get('/file/:reportDir/:fileName', reportController.getReportFile.bind(reportController));
  router.get('/files/:reportDir', reportController.listReportFiles.bind(reportController));
  
  // Todas as outras rotas protegidas por autenticação JWT
  router.use(authMiddleware);
  
  // Rota para listar diretórios e arquivos
  router.get('/directories', reportController.listDirectories.bind(reportController));
  
  // Rota para upload de relatório
  router.post('/upload', uploadMiddleware.single('report'), reportController.uploadReport.bind(reportController));
  
  // Rota para listar todos os uploads
  router.get('/uploads', reportController.getAllUploads.bind(reportController));
  
  // Rota para obter um upload específico
  router.get('/uploads/:id', reportController.getUploadById.bind(reportController));
  
  // Rota para listar todos os relatórios
  router.get('/reports', reportController.getAllReports.bind(reportController));
  
  // Rota para obter um relatório específico
  router.get('/reports/:id', reportController.getReportById.bind(reportController));
  
  return router;
}; 