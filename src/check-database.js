const pool = require('./infrastructure/database/config');

async function checkReportsTable() {
  try {
    console.log('Verificando a tabela admin.reports...');
    
    // Verificar se a tabela existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'admin' 
        AND table_name = 'reports'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      console.log('A tabela admin.reports não existe!');
      return;
    }
    
    console.log('A tabela admin.reports existe.');
    
    // Verificar a estrutura da tabela
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'admin' 
      AND table_name = 'reports';
    `);
    
    console.log('Estrutura da tabela:');
    columns.rows.forEach(column => {
      console.log(`- ${column.column_name}: ${column.data_type}`);
    });
    
    // Contar os registros
    const countResult = await pool.query('SELECT COUNT(*) FROM admin.reports;');
    const count = parseInt(countResult.rows[0].count);
    
    console.log(`\nTotal de registros na tabela: ${count}`);
    
    if (count > 0) {
      // Listar os registros
      const records = await pool.query(`
        SELECT id, directory_name, file_size, upload_date, uploaded_by, created_at
        FROM admin.reports
        ORDER BY created_at DESC;
      `);
      
      console.log('\nÚltimos registros:');
      records.rows.forEach(record => {
        console.log(`[${record.id}] ${record.directory_name} - ${formatFileSize(record.file_size)} (${record.upload_date})`);
      });
    }
  } catch (error) {
    console.error('Erro ao verificar a tabela de relatórios:', error);
  } finally {
    // Encerrar o pool de conexões
    pool.end();
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Executar a verificação
checkReportsTable(); 