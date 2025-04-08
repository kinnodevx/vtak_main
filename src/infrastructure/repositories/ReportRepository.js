const pool = require('../database/config');

class ReportRepository {
  async create(reportData) {
    const { directory_name, file_size, uploaded_by } = reportData;
    
    const query = `
      INSERT INTO admin.reports (directory_name, file_size, uploaded_by, upload_date, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, directory_name, file_size, upload_date, uploaded_by, created_at, updated_at
    `;
    
    const result = await pool.query(query, [directory_name, file_size, uploaded_by]);
    return result.rows[0];
  }
  
  async getAllReports() {
    const query = `
      SELECT id, directory_name, file_size, upload_date, uploaded_by, created_at, updated_at
      FROM admin.reports
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }
  
  async getReportById(id) {
    const query = `
      SELECT id, directory_name, file_size, upload_date, uploaded_by, created_at, updated_at
      FROM admin.reports
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  async updateReport(id, reportData) {
    const { directory_name, file_size } = reportData;
    
    const query = `
      UPDATE admin.reports
      SET directory_name = $1, file_size = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, directory_name, file_size, upload_date, uploaded_by, created_at, updated_at
    `;
    
    const result = await pool.query(query, [directory_name, file_size, id]);
    return result.rows[0];
  }
  
  async deleteReport(id) {
    const query = 'DELETE FROM admin.reports WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = ReportRepository; 