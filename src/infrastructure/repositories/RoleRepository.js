const pool = require('../database/config');

class RoleRepository {
  async create(roleData) {
    const query = `
      INSERT INTO admin.user_roles (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(query, [roleData.name, roleData.description]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM admin.user_roles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findByName(name) {
    const query = 'SELECT * FROM admin.user_roles WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  async findAll() {
    const query = 'SELECT * FROM admin.user_roles';
    const result = await pool.query(query);
    return result.rows;
  }

  async update(id, roleData) {
    const query = `
      UPDATE admin.user_roles 
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [roleData.name, roleData.description, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM admin.user_roles WHERE id = $1';
    await pool.query(query, [id]);
  }

  async assignRoleToUser(userId, roleId) {
    const query = `
      UPDATE admin.users 
      SET role_id = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [roleId, userId]);
    return result.rows[0];
  }

  async getUserRole(userId) {
    const query = `
      SELECT r.* 
      FROM admin.user_roles r
      JOIN admin.users u ON u.role_id = r.id
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = RoleRepository; 