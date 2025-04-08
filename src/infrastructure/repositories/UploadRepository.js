const db = require('../database/connection');

class UploadRepository {
    async create(uploadData) {
        const { directory_name, total_size, files_count } = uploadData;
        
        try {
            const query = `
                INSERT INTO admin.uploads (directory_name, total_size, files_count)
                VALUES ($1, $2, $3)
                RETURNING id, directory_name, total_size, files_count, created_at, updated_at
            `;
            
            const values = [directory_name, total_size, files_count];
            const result = await db.query(query, values);
            
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar upload:', error);
            throw error;
        }
    }

    async createFile(fileData) {
        const { upload_id, file_name, file_size, file_type } = fileData;
        
        try {
            const query = `
                INSERT INTO admin.upload_files (upload_id, file_name, file_size, file_type)
                VALUES ($1, $2, $3, $4)
                RETURNING id, upload_id, file_name, file_size, file_type, created_at, updated_at
            `;
            
            const values = [upload_id, file_name, file_size, file_type];
            const result = await db.query(query, values);
            
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar arquivo de upload:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            const query = `
                SELECT u.*, 
                       COUNT(uf.id) as actual_files_count,
                       SUM(uf.file_size) as actual_total_size
                FROM admin.uploads u
                LEFT JOIN admin.upload_files uf ON u.id = uf.upload_id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            `;
            
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar uploads:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const query = `
                SELECT u.*, 
                       json_agg(json_build_object(
                           'id', uf.id,
                           'file_name', uf.file_name,
                           'file_size', uf.file_size,
                           'file_type', uf.file_type,
                           'created_at', uf.created_at,
                           'updated_at', uf.updated_at
                       )) as files
                FROM admin.uploads u
                LEFT JOIN admin.upload_files uf ON u.id = uf.upload_id
                WHERE u.id = $1
                GROUP BY u.id
            `;
            
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar upload por ID:', error);
            throw error;
        }
    }

    async findByDirectoryName(directoryName) {
        try {
            const query = `
                SELECT u.*, 
                       json_agg(json_build_object(
                           'id', uf.id,
                           'file_name', uf.file_name,
                           'file_size', uf.file_size,
                           'file_type', uf.file_type,
                           'created_at', uf.created_at,
                           'updated_at', uf.updated_at
                       )) as files
                FROM admin.uploads u
                LEFT JOIN admin.upload_files uf ON u.id = uf.upload_id
                WHERE u.directory_name = $1
                GROUP BY u.id
            `;
            
            const result = await db.query(query, [directoryName]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar upload por nome do diretório:', error);
            throw error;
        }
    }
}

module.exports = { UploadRepository }; 