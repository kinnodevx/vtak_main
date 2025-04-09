const { pool } = require('../database/connection');

class RelatoryRepository {
  async create(relatoryData) {
    try {
      console.log('Dados recebidos para criação:', relatoryData);
      
      const query = `
        INSERT INTO relatories (
          emission_date,
          date_cession,
          cpf_bancarizador_endossante,
          n_contract
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      // Garante que os valores não sejam nulos para campos NOT NULL
      const values = [
        relatoryData.emission_date,
        relatoryData.date_cession || null,
        relatoryData.cpf_bancarizador_endossante || '00000000000000',
        relatoryData.n_contract || '00000000000000000000000000000000000000000000000000'
      ];
      
      console.log('Executando query com valores:', values);
      
      const result = await pool.query(query, values);
      console.log('Resultado da query:', result.rows[0]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      throw error;
    }
  }
  
  async findAll() {
    try {
      const query = 'SELECT * FROM relatories ORDER BY id DESC';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      throw error;
    }
  }
  
  async findById(id) {
    try {
      const query = 'SELECT * FROM relatories WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar relatório por ID:', error);
      throw error;
    }
  }
}

module.exports = { RelatoryRepository }; 