const path = require('path');
const fs = require('fs').promises;
const AdmZip = require('adm-zip');
const ReportRepository = require('../../infrastructure/repositories/ReportRepository');
const { UploadRepository } = require('../../infrastructure/repositories/UploadRepository');
const { v4: uuidv4 } = require('uuid');

class ReportController {
  constructor() {
    this.reportRepository = new ReportRepository();
    this.uploadRepository = new UploadRepository();
  }
  
  async uploadReport(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      console.log('Arquivo recebido:', {
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      });

      const zip = new AdmZip(req.file.path);
      const extractPath = path.join(process.cwd(), 'relatories', `relatory_${Date.now()}`);
      
      console.log('Extraindo ZIP para:', extractPath);
      zip.extractAllTo(extractPath, true);
      console.log('ZIP extraído com sucesso');

      // Remove o arquivo ZIP original após extração
      await fs.unlink(req.file.path);
      console.log('Arquivo ZIP original removido');

      // Lista o conteúdo do diretório após extração
      const files = await fs.readdir(extractPath);
      console.log('Conteúdo do diretório após extração:', files);

      // Verifica se os arquivos necessários estão presentes
      const requiredFiles = [
        'Relatorio - Capag.xlsx',
        'Relatorio de estoque.xlsx',
        'Relatorio Liquidados.xlt',
        'Relatorio - Produção.xlsx'
      ];

      const missingFiles = requiredFiles.filter(file => !files.includes(file));
      if (missingFiles.length > 0) {
        console.log('Arquivos necessários ausentes:', missingFiles);
        return res.status(400).json({ 
          error: 'Arquivos necessários ausentes no ZIP',
          missingFiles 
        });
      }

      // Calcula o tamanho total dos arquivos
      let totalSize = 0;
      const fileDetails = [];

      for (const file of files) {
        const filePath = path.join(extractPath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        
        fileDetails.push({
          file_name: file,
          file_size: stats.size,
          file_type: path.extname(file).substring(1)
        });
      }

      console.log('Tamanho total dos arquivos:', totalSize);
      console.log('Detalhes dos arquivos:', fileDetails);

      // Registra o upload no banco de dados
      const uploadData = {
        directory_name: path.basename(extractPath),
        total_size: totalSize,
        files_count: files.length
      };

      console.log('Registrando upload:', uploadData);
      const upload = await this.uploadRepository.create(uploadData);
      console.log('Upload registrado:', upload);

      // Registra cada arquivo do upload
      for (const fileDetail of fileDetails) {
        const fileData = {
          upload_id: upload.id,
          ...fileDetail
        };
        console.log('Registrando arquivo:', fileData);
        await this.uploadRepository.createFile(fileData);
      }

      // Cria o objeto de relatório
      const report = {
        directory_name: path.basename(extractPath),
        file_size: totalSize,
        uploaded_by: req.user.id
      };

      console.log('Dados do relatório:', report);

      // Salva o relatório no banco de dados
      const savedReport = await this.reportRepository.create(report);
      console.log('Relatório salvo:', savedReport);

      res.status(201).json({
        message: 'Relatório processado com sucesso',
        report: savedReport,
        upload: {
          id: upload.id,
          directory_name: upload.directory_name,
          total_size: upload.total_size,
          files_count: upload.files_count,
          files: fileDetails
        }
      });

    } catch (error) {
      console.error('Erro ao processar relatório:', error);
      res.status(500).json({ error: 'Erro ao processar o relatório' });
    }
  }
  
  async getAllReports(req, res) {
    try {
      const reports = await this.reportRepository.findAll();
      res.json(reports);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      res.status(500).json({ error: 'Erro ao buscar relatórios' });
    }
  }
  
  async getReportById(req, res) {
    try {
      const report = await this.reportRepository.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }
      res.json(report);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      res.status(500).json({ error: 'Erro ao buscar relatório' });
    }
  }
  
  async getAllUploads(req, res) {
    try {
      const uploads = await this.uploadRepository.findAll();
      res.json(uploads);
    } catch (error) {
      console.error('Erro ao buscar uploads:', error);
      res.status(500).json({ error: 'Erro ao buscar uploads' });
    }
  }
  
  async getUploadById(req, res) {
    try {
      const upload = await this.uploadRepository.findById(req.params.id);
      if (!upload) {
        return res.status(404).json({ error: 'Upload não encontrado' });
      }
      res.json(upload);
    } catch (error) {
      console.error('Erro ao buscar upload:', error);
      res.status(500).json({ error: 'Erro ao buscar upload' });
    }
  }

  async getReportFile(req, res) {
    try {
      const { reportDir, fileName } = req.params;
      const filePath = path.join(process.cwd(), 'relatories', reportDir, fileName);

      // Verifica se o arquivo existe
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      // Envia o arquivo
      res.sendFile(filePath);
    } catch (error) {
      console.error('Erro ao buscar arquivo:', error);
      res.status(500).json({ error: 'Erro ao buscar arquivo' });
    }
  }

  async listReportFiles(req, res) {
    try {
      const { reportDir } = req.params;
      const dirPath = path.join(process.cwd(), 'relatories', reportDir);

      // Verifica se o diretório existe
      try {
        await fs.access(dirPath);
      } catch (error) {
        return res.status(404).json({ error: 'Diretório não encontrado' });
      }

      // Lista os arquivos do diretório
      const files = await fs.readdir(dirPath);
      const fileDetails = [];

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        fileDetails.push({
          name: file,
          size: stats.size,
          type: path.extname(file).substring(1),
          created: stats.birthtime,
          modified: stats.mtime
        });
      }

      res.json(fileDetails);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
  }

  async listDirectories(req, res) {
    try {
      const baseDir = path.join(process.cwd(), 'relatories');
      
      // Verifica se o diretório base existe
      try {
        await fs.access(baseDir);
      } catch (error) {
        return res.status(404).json({ error: 'Diretório de relatórios não encontrado' });
      }
      
      // Lista todas as subpastas
      const directories = await fs.readdir(baseDir);
      
      // Para cada subpasta, obtém os arquivos
      const directoriesWithFiles = await Promise.all(
        directories.map(async (dir) => {
          const dirPath = path.join(baseDir, dir);
          const stats = await fs.stat(dirPath);
          
          // Verifica se é um diretório
          if (!stats.isDirectory()) {
            return null;
          }
          
          // Lista os arquivos do diretório
          const files = await fs.readdir(dirPath);
          
          // Obtém detalhes de cada arquivo
          const fileDetails = await Promise.all(
            files.map(async (file) => {
              const filePath = path.join(dirPath, file);
              const fileStats = await fs.stat(filePath);
              
              return {
                name: file,
                size: fileStats.size,
                type: path.extname(file).substring(1),
                created: fileStats.birthtime,
                modified: fileStats.mtime
              };
            })
          );
          
          return {
            name: dir,
            path: dir,
            created: stats.birthtime,
            modified: stats.mtime,
            files: fileDetails
          };
        })
      );
      
      // Remove entradas nulas (não são diretórios)
      const validDirectories = directoriesWithFiles.filter(dir => dir !== null);
      
      return res.json({
        base_directory: 'relatories',
        directories: validDirectories
      });
    } catch (error) {
      console.error('Erro ao listar diretórios:', error);
      return res.status(500).json({ error: 'Erro ao listar diretórios' });
    }
  }

  async checkProductionReport(req, res) {
    try {
      const { reportDir } = req.params;
      const baseDir = path.join(process.cwd(), 'relatories');
      const targetDir = path.join(baseDir, reportDir);
      const targetFile = 'Relatorio - Produção.xlsx';
      
      // Verifica se o diretório existe
      try {
        await fs.access(targetDir);
      } catch (error) {
        return res.status(404).json({ 
          error: 'Diretório não encontrado',
          exists: false
        });
      }
      
      // Verifica se o arquivo existe
      const filePath = path.join(targetDir, targetFile);
      try {
        await fs.access(filePath);
        const stats = await fs.stat(filePath);
        
        return res.json({
          exists: true,
          file: {
            name: targetFile,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          }
        });
      } catch (error) {
        return res.json({
          exists: false,
          message: 'Arquivo de produção não encontrado neste diretório'
        });
      }
    } catch (error) {
      console.error('Erro ao verificar arquivo de produção:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = { ReportController };
