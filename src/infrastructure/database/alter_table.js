const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function alterTable() {
  try {
    // Lê o arquivo de migração
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '003_alter_relatories_table.sql'),
      'utf8'
    );

    // Executa a migração
    await pool.query(migrationSQL);
    console.log('Alteração da tabela executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar alteração da tabela:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await pool.end();
  }
}

// Executa a alteração
alterTable(); 