const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { ReportRepository } = require('../../infrastructure/repositories/ReportRepository');

// Diretório base para relatórios
const reportsBaseDir = path.join(__dirname, '../../../reports');

// Garantir que o diretório base existe
fs.ensureDirSync(reportsBaseDir);

// Função para encontrar o próximo número de diretório disponível
async function getNextDirectoryNumber() {
  try {
    // Verificar se o diretório base existe
    if (!await fs.pathExists(reportsBaseDir)) {
      await fs.mkdir(reportsBaseDir);
      return 1;
    }
    
    // Listar diretórios existentes
    const dirs = await fs.readdir(reportsBaseDir);
    
    // Filtrar apenas diretórios que seguem o padrão "relatory_XX"
    const reportDirs = dirs.filter(dir => /^relatory_\d+$/.test(dir));
    
    if (reportDirs.length === 0) {
      return 1;
    }
    
    // Extrair os números e encontrar o maior
    const numbers = reportDirs.map(dir => {
      const match = dir.match(/^relatory_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    const maxNumber = Math.max(...numbers);
    return maxNumber + 1;
  } catch (error) {
    console.error('Erro ao obter próximo número de diretório:', error);
    return 1; // Em caso de erro, retornar 1 como padrão
  }
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const nextNumber = await getNextDirectoryNumber();
      const paddedNumber = String(nextNumber).padStart(2, '0');
      const dirName = `relatory_${paddedNumber}`;
      const dirPath = path.join(reportsBaseDir, dirName);
      
      // Garantir que o diretório existe
      await fs.ensureDir(dirPath);
      
      cb(null, dirPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Usar o nome original do arquivo, pois será um ZIP que será extraído posteriormente
    cb(null, file.originalname);
  }
});

// Configuração do filtro de arquivo
const fileFilter = (req, file, cb) => {
  // Aceitar arquivo zip pelo mimetype ou pela extensão do arquivo
  if (file.mimetype === 'application/zip' || 
      file.mimetype === 'application/x-zip-compressed' || 
      file.originalname.toLowerCase().endsWith('.zip')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos ZIP são permitidos'), false);
  }
};

// Criar o middleware de upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // Limitar a 2GB (limite maior para arquivos ZIP)
  }
});

module.exports = upload; 