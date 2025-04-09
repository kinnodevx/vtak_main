const AccessTokenRepository = require('../../infrastructure/repositories/AccessTokenRepository');

const accessTokenRepository = new AccessTokenRepository();

/**
 * Middleware para verificar chaves de API (CI/CS)
 * Este middleware verifica se a aplicação cliente forneceu chaves de API válidas
 * As chaves são geradas pelo administrador através da rota /admin/clients/api-keys
 */
const clientAuthMiddleware = async (req, res, next) => {
  try {
    // Obter CI e CS do cabeçalho da requisição
    const ci = req.headers['x-client-id'];
    const cs = req.headers['x-client-secret'];

    if (!ci || !cs) {
      return res.status(401).json({ error: 'Chaves de API não fornecidas' });
    }

    // Verificar se o CI existe no banco de dados
    const accessToken = await accessTokenRepository.findByCi(ci);
    if (!accessToken) {
      return res.status(401).json({ error: 'Chave de API inválida ou revogada' });
    }

    // Verificar se o CS corresponde
    if (accessToken.cs !== cs) {
      return res.status(401).json({ error: 'Chave de API secreta inválida' });
    }

    // Aplicação cliente autenticada, continuar
    next();
  } catch (error) {
    console.error('Erro na verificação da chave de API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = clientAuthMiddleware; 