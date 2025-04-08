const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para armazenamento em disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const baseDir = 'relatories';
        
        // Cria o diretório base se não existir
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }
        
        cb(null, baseDir);
    },
    filename: function (req, file, cb) {
        // Gera um nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas arquivos ZIP
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos ZIP são permitidos'), false);
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 // 2GB
    }
});

module.exports = upload; 