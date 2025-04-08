const path = require('path');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const { ReportRepository } = require('../../infrastructure/repositories/ReportRepository');

class ReportController {
  constructor() {
    this.reportRepository = new ReportRepository();
  }
  
  async uploadReport(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      
      const { originalname, path: filePath, size } = req.file;
      const directoryName = path.basename(path.dirname(filePath));
      
      console.log(`Processando upload para arquivo ZIP: ${originalname} no diretório: ${directoryName}`);
      
      // Verificar se é um arquivo ZIP válido
      if (!originalname.toLowerCase().endsWith('.zip')) {
        // Remover o arquivo enviado se não for um ZIP
        await fs.unlink(filePath);
        return res.status(400).json({ error: 'O arquivo deve ser do tipo ZIP' });
      }
      
      try {
        // Extrair o arquivo ZIP
        const zip = new AdmZip(filePath);
        const extractPath = path.dirname(filePath);
        zip.extractAllTo(extractPath, true); // true para sobrescrever
        console.log(`Arquivo ZIP extraído para: ${extractPath}`);
        
        // Remover o arquivo ZIP após extração
        await fs.unlink(filePath);
        
        // Verificar arquivos obrigatórios
        const requiredFiles = [
          'Relatorio - Capag.xlsx',
          'Relatorio de estoque.xlsx',
          'Relatorio Liquidados.xlt',
          'Relatorio - Produção.xlsx'
        ];
        
        const directoryContents = await fs.readdir(extractPath);
        const missingFiles = requiredFiles.filter(file => !directoryContents.includes(file));
        
        if (missingFiles.length > 0) {
          return res.status(400).json({ 
            error: 'Arquivos obrigatórios não encontrados no ZIP', 
            missingFiles 
          });
        }
        
        // Obter o tamanho total dos arquivos extraídos
        let totalSize = 0;
        for (const file of directoryContents) {
          const stats = await fs.stat(path.join(extractPath, file));
          totalSize += stats.size;
        }
        
        // Registrar no banco de dados
        const report = {
          directory_name: directoryName,
          file_size: totalSize,
          uploaded_by: req.user.id
        };
        
        // Criar um novo relatório no banco de dados
        const result = await this.reportRepository.createReport(report);
        console.log(`Novo relatório criado: ${directoryName}`);
        
        return res.status(201).json({
          message: 'Relatório enviado e processado com sucesso',
          id: result.id,
          directoryName: result.directory_name,
          fileSize: result.file_size,
          fileSizeFormatted: this.formatFileSize(result.file_size),
          uploadDate: result.upload_date,
          uploadedBy: result.uploaded_by,
          files: directoryContents
        });
      } catch (zipError) {
        console.error('Erro ao extrair o arquivo ZIP:', zipError);
        // Tentar remover o arquivo em caso de erro
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Erro ao remover arquivo ZIP inválido:', unlinkError);
        }
        return res.status(400).json({ error: 'O arquivo ZIP não pôde ser processado' });
      }
    } catch (error) {
      console.error('Erro ao fazer upload do relatório:', error);
      return res.status(500).json({ error: 'Erro ao fazer upload do relatório' });
    }
  }
  
  // Função helper para formatar o tamanho do arquivo
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  async listReports(req, res) {
    try {
      const reports = await this.reportRepository.getAllReports();
      
      // Verificar se cada diretório existe e listar os arquivos
      const reportsWithDetails = await Promise.all(reports.map(async report => {
        const reportPath = path.join(__dirname, '../../../reports', report.directory_name);
        let files = [];
        let fileDetails = [];
        
        if (await fs.pathExists(reportPath)) {
          files = await fs.readdir(reportPath);
          fileDetails = await Promise.all(files.map(async (file) => {
            const filePath = path.join(reportPath, file);
            const stats = await fs.stat(filePath);
            
            return {
              name: file,
              size: stats.size,
              sizeFormatted: this.formatFileSize(stats.size),
              created: stats.birthtime,
              modified: stats.mtime
            };
          }));
        }
        
        return {
          id: report.id,
          directory_name: report.directory_name,
          file_size: report.file_size,
          file_size_formatted: this.formatFileSize(report.file_size),
          upload_date: report.upload_date,
          uploaded_by: report.uploaded_by,
          created_at: report.created_at,
          files: fileDetails,
          files_count: files.length
        };
      }));
      
      return res.json({
        total: reportsWithDetails.length,
        reports: reportsWithDetails
      });
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);
      return res.status(500).json({ error: 'Erro ao listar relatórios' });
    }
  }
  
  async getReportFile(req, res) {
    try {
      const { reportDir, fileName } = req.params;
      
      // Validar parâmetros
      if (!reportDir || !fileName) {
        return res.status(400).json({ error: 'Diretório do relatório e nome do arquivo são obrigatórios' });
      }
      
      // Sanitizar os parâmetros para evitar path traversal
      const sanitizedReportDir = path.basename(reportDir);
      const sanitizedFileName = path.basename(fileName);
      
      // Construir o caminho completo do arquivo
      const baseDir = path.resolve(__dirname, '../../../reports');
      const filePath = path.join(baseDir, sanitizedReportDir, sanitizedFileName);
      
      // Verificar se o diretório existe
      if (!await fs.pathExists(path.dirname(filePath))) {
        return res.status(404).json({ error: 'Diretório do relatório não encontrado' });
      }
      
      // Verificar se o arquivo existe
      if (!await fs.pathExists(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }
      
      // Enviar o arquivo
      return res.sendFile(filePath);
    } catch (error) {
      console.error('Erro ao obter arquivo de relatório:', error);
      return res.status(500).json({ error: 'Erro ao obter arquivo de relatório' });
    }
  }
  
  async listReportFiles(req, res) {
    try {
      const { reportDir } = req.params;
      
      // Validar parâmetros
      if (!reportDir) {
        return res.status(400).json({ error: 'Diretório do relatório é obrigatório' });
      }
      
      // Sanitizar o parâmetro para evitar path traversal
      const sanitizedReportDir = path.basename(reportDir);
      
      // Construir o caminho completo do diretório
      const baseDir = path.resolve(__dirname, '../../../reports');
      const reportPath = path.join(baseDir, sanitizedReportDir);
      
      // Verificar se o diretório existe
      if (!await fs.pathExists(reportPath)) {
        return res.status(404).json({ error: 'Diretório do relatório não encontrado' });
      }
      
      // Listar arquivos no diretório
      const files = await fs.readdir(reportPath);
      
      // Obter informações detalhadas sobre cada arquivo
      const fileDetails = await Promise.all(files.map(async (file) => {
        const filePath = path.join(reportPath, file);
        const stats = await fs.stat(filePath);
        
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory()
        };
      }));
      
      return res.json({
        reportDir: sanitizedReportDir,
        files: fileDetails
      });
    } catch (error) {
      console.error('Erro ao listar arquivos do relatório:', error);
      return res.status(500).json({ error: 'Erro ao listar arquivos do relatório' });
    }
  }
}

module.exports = ReportController;
