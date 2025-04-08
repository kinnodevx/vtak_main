const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function alterCpfColumn() {
  try {
    // Lê o arquivo de migração
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '004_alter_relatories_cpf_column.sql'),
      'utf8'
    );

    // Executa a migração
    await pool.query(migrationSQL);
    console.log('Alteração da coluna cpf_bancarizador_endossante executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar alteração da coluna cpf_bancarizador_endossante:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await pool.end();
  }
}

// Executa a alteração
alterCpfColumn(); 