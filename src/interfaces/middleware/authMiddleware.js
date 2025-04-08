const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Verificar se o token está presente no cabeçalho
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Verificar o formato do token
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        // Verificar o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
        
        // Adicionar informações do usuário à requisição
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role_id: decoded.role_id
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = { authMiddleware }; 