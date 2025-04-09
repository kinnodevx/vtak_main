const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { v4: uuidv4 } = require('uuid');

class UploadService {
    constructor() {
        this.baseDir = 'relatories';
    }

    async processUpload(file) {
        try {
            console.log('Processando upload do arquivo:', file.originalname);
            
            // Gera um nome único para o diretório
            const directoryName = `relatory${uuidv4().substring(0, 8)}`;
            const extractPath = path.join(this.baseDir, directoryName);
            
            // Cria o diretório de extração
            if (!fs.existsSync(extractPath)) {
                fs.mkdirSync(extractPath, { recursive: true });
            }
            
            // Extrai o arquivo ZIP
            const zip = new AdmZip(file.path);
            zip.extractAllTo(extractPath, true);
            
            // Remove o arquivo ZIP original
            fs.unlinkSync(file.path);
            
            // Verifica os arquivos extraídos
            const files = fs.readdirSync(extractPath);
            console.log('Arquivos extraídos:', files);
            
            // Calcula o tamanho total dos arquivos
            let totalSize = 0;
            files.forEach(file => {
                const filePath = path.join(extractPath, file);
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
            });
            
            // Retorna os dados do upload
            return {
                id: uuidv4(),
                directoryName,
                originalFileName: file.originalname,
                fileCount: files.length,
                totalSize,
                uploadDate: new Date(),
                files
            };
            
        } catch (error) {
            console.error('Erro ao processar upload:', error);
            throw new Error('O arquivo ZIP não pôde ser processado');
        }
    }

    async getAllUploads() {
        try {
            const directories = fs.readdirSync(this.baseDir);
            return directories.map(dir => {
                const dirPath = path.join(this.baseDir, dir);
                const files = fs.readdirSync(dirPath);
                let totalSize = 0;
                
                files.forEach(file => {
                    const filePath = path.join(dirPath, file);
                    const stats = fs.statSync(filePath);
                    totalSize += stats.size;
                });
                
                return {
                    id: dir,
                    directoryName: dir,
                    fileCount: files.length,
                    totalSize,
                    files
                };
            });
        } catch (error) {
            console.error('Erro ao listar uploads:', error);
            throw new Error('Não foi possível listar os uploads');
        }
    }

    async getUploadById(id) {
        try {
            const uploads = await this.getAllUploads();
            return uploads.find(upload => upload.id === id);
        } catch (error) {
            console.error('Erro ao buscar upload por ID:', error);
            throw new Error('Upload não encontrado');
        }
    }

    async getUploadByDirectoryName(directoryName) {
        try {
            const uploads = await this.getAllUploads();
            return uploads.find(upload => upload.directoryName === directoryName);
        } catch (error) {
            console.error('Erro ao buscar upload por nome do diretório:', error);
            throw new Error('Upload não encontrado');
        }
    }
}

module.exports = new UploadService(); 