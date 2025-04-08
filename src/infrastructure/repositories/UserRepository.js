const pool = require('../database/config');

class UserRepository {
  async create(userData) {
    const query = `
      INSERT INTO admin.users (name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role_id, created_at
    `;
    
    const result = await pool.query(query, [userData.name, userData.email, userData.password, userData.role_id || 2]); // role_id 2 é o usuário comum
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM admin.users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM admin.users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, userData) {
    const query = `
      UPDATE admin.users 
      SET name = $1, email = $2, password = $3, role_id = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, email, role_id, created_at, updated_at
    `;
    
    const result = await pool.query(query, [userData.name, userData.email, userData.password, userData.role_id, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM admin.users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = UserRepository; 