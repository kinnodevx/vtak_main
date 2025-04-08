const uploadService = require('../../application/services/UploadService');

class UploadController {
    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
            }

            const upload = await uploadService.processUpload(req.file);
            return res.status(201).json(upload);
        } catch (error) {
            console.error('Erro no upload:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllUploads(req, res) {
        try {
            const uploads = await uploadService.getAllUploads();
            return res.json(uploads);
        } catch (error) {
            console.error('Erro ao listar uploads:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async getUploadById(req, res) {
        try {
            const upload = await uploadService.getUploadById(req.params.id);
            if (!upload) {
                return res.status(404).json({ error: 'Upload não encontrado' });
            }
            return res.json(upload);
        } catch (error) {
            console.error('Erro ao buscar upload:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async getUploadByDirectoryName(req, res) {
        try {
            const upload = await uploadService.getUploadByDirectoryName(req.params.directoryName);
            if (!upload) {
                return res.status(404).json({ error: 'Upload não encontrado' });
            }
            return res.json(upload);
        } catch (error) {
            console.error('Erro ao buscar upload:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UploadController(); 