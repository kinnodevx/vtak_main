const express = require('express');
const router = express.Router();
const { ReportController } = require('../controllers/ReportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const reportController = new ReportController();

// Rota para upload de relatório
router.post('/upload', authMiddleware, uploadMiddleware.single('report'), reportController.uploadReport.bind(reportController));

// Rota para listar todos os uploads
router.get('/uploads', authMiddleware, reportController.getAllUploads.bind(reportController));

// Rota para obter um upload específico
router.get('/uploads/:id', authMiddleware, reportController.getUploadById.bind(reportController));

// Rota para listar todos os relatórios
router.get('/reports', authMiddleware, reportController.getAllReports.bind(reportController));

// Rota para obter um relatório específico
router.get('/reports/:id', authMiddleware, reportController.getReportById.bind(reportController));

module.exports = router; 