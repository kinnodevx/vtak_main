const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function migrate() {
  try {
    // Lê o arquivo de migração
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '002_create_relatories_table.sql'),
      'utf8'
    );

    // Executa a migração
    await pool.query(migrationSQL);
    console.log('Migração executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await pool.end();
  }
}

// Executa a migração
migrate(); 