const express = require('express');
const router = express.Router();
const { ReportController } = require('../controllers/ReportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

module.exports = () => {
  const reportController = new ReportController();

  // Rotas públicas (sem autenticação)
  router.get('/check-production/:reportDir', reportController.checkProductionReport.bind(reportController));
  router.get('/file/:reportDir/:fileName', reportController.getReportFile.bind(reportController));
  router.get('/files/:reportDir', reportController.listReportFiles.bind(reportController));
  router.get('/directories', reportController.listDirectories.bind(reportController));
  router.get('/read-production/:reportDir', reportController.readProductionReport.bind(reportController));
  router.get('/relatories', reportController.readRelatories.bind(reportController));
  
  // Todas as outras rotas protegidas por autenticação JWT
  router.use(authMiddleware);
  
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
  
  // Rota para ler relatórios com filtros
  router.get('/check-production', reportController.checkProductionReport.bind(reportController));
  router.get('/read-production', reportController.readProductionReport.bind(reportController));
  router.get('/relatories', reportController.readRelatories.bind(reportController));
  
  return router;
}; 