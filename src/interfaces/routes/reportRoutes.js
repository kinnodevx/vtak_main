const express = require('express');
const router = express.Router();
const jwtAuthMiddleware = require('../middleware/jwtAuth');
const upload = require('../middleware/uploadMiddleware');
const ReportController = require('../controllers/ReportController');

module.exports = () => {
  const reportController = new ReportController();

  // Rotas públicas
  router.get('/file/:reportDir/:fileName', reportController.getReportFile.bind(reportController));
  router.get('/files/:reportDir', reportController.listReportFiles.bind(reportController));
  
  // Todas as outras rotas protegidas por autenticação JWT
  router.use(jwtAuthMiddleware);
  
  // Rota para upload de relatório (usando o middleware de upload para um único arquivo com nome 'report')
  router.post('/upload', upload.single('report'), reportController.uploadReport.bind(reportController));
  
  // Rota para listar todos os relatórios
  router.get('/', reportController.listReports.bind(reportController));
  
  return router;
}; 