const AccessTokenRepository = require('../../infrastructure/repositories/AccessTokenRepository');

const authMiddleware = async (req, res, next) => {
  try {
    const ci = req.headers['x-client-id'];
    const cs = req.headers['x-client-secret'];
    const agent = req.headers['user-agent'];

    if (!ci || !cs) {
      return res.status(401).json({ error: 'CI e CS são obrigatórios' });
    }

    const accessTokenRepository = new AccessTokenRepository();
    const token = await accessTokenRepository.findByCi(ci);

    if (!token) {
      return res.status(401).json({ error: 'CI inválido' });
    }

    if (token.cs !== cs) {
      return res.status(401).json({ error: 'CS inválido' });
    }

    if (token.agent !== agent) {
      return res.status(401).json({ error: 'Agente inválido' });
    }

    req.token = token;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware; 