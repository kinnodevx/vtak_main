const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDatabase() {
  try {
    // Verificar se o banco já existe
    const checkDb = await pool.query(`
      SELECT 1 FROM pg_database WHERE datname = $1
    `, [process.env.DB_NAME]);
    
    if (checkDb.rowCount === 0) {
      // Criar banco de dados
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Banco de dados ${process.env.DB_NAME} criado com sucesso!`);
    } else {
      console.log(`Banco de dados ${process.env.DB_NAME} já existe.`);
    }
  } catch (error) {
    console.error('Erro ao verificar/criar banco de dados:', error);
    process.exit(1);
  }

  // Fechar conexão
  await pool.end();

  // Criar nova conexão com o banco de dados criado
  const dbPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Executar script SQL para criar todas as tabelas
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Separar os comandos SQL por ponto e vírgula
    const commands = sqlScript.split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
      .filter(cmd => !cmd.startsWith('\\c')); // Ignorar comandos \c do psql
      
    for (const command of commands) {
      try {
        await dbPool.query(command);
      } catch (err) {
        console.error(`Erro ao executar comando: ${command}`);
        console.error(err);
      }
    }
    
    console.log('Esquema e tabelas criados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar script SQL:', error);
    process.exit(1);
  }

  await dbPool.end();
}

initDatabase(); 