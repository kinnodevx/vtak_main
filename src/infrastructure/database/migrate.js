const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function migrate() {
  try {
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '001_create_reports_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Executar a migração
    await pool.query(migrationSQL);
    console.log('Migração executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    // Fechar a conexão
    await pool.end();
  }
}

// Executar a migração
migrate(); 