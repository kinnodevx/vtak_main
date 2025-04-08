const pool = require('../database/config');

class AccessTokenRepository {
  async create(ci, cs, agent) {
    const query = `
      INSERT INTO admin.access_tokens (ci, cs, agent, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const values = [ci, cs, agent];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findByCi(ci) {
    const query = 'SELECT * FROM admin.access_tokens WHERE ci = $1';
    const result = await pool.query(query, [ci]);
    return result.rows[0];
  }

  async update(ci, cs) {
    const query = `
      UPDATE admin.access_tokens 
      SET cs = $1, updated_at = CURRENT_TIMESTAMP
      WHERE ci = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [cs, ci]);
    return result.rows[0];
  }

  async delete(ci) {
    const query = 'DELETE FROM admin.access_tokens WHERE ci = $1';
    return await pool.query(query, [ci]);
  }

  async findAll() {
    const query = 'SELECT * FROM admin.access_tokens ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = AccessTokenRepository; 