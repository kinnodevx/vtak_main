const crypto = require('crypto');

class ManageAccessToken {
  constructor(accessTokenRepository) {
    this.accessTokenRepository = accessTokenRepository;
  }

  async generateToken(agent) {
    const ci = crypto.randomBytes(32).toString('hex');
    const cs = crypto.randomBytes(32).toString('hex');
    
    const token = await this.accessTokenRepository.create(ci, cs, agent);
    return {
      ci: token.ci,
      cs: token.cs
    };
  }

  async validateToken(ci, cs, agent) {
    const token = await this.accessTokenRepository.findByCi(ci);
    
    if (!token) {
      throw new Error('CI inválido');
    }

    if (token.cs !== cs) {
      throw new Error('CS inválido');
    }

    if (token.agent !== agent) {
      throw new Error('Agente inválido');
    }

    return token;
  }

  async rotateToken(ci, agent) {
    const token = await this.accessTokenRepository.findByCi(ci);
    
    if (!token) {
      throw new Error('CI inválido');
    }

    if (token.agent !== agent) {
      throw new Error('Agente inválido');
    }

    const newCs = crypto.randomBytes(32).toString('hex');
    const updatedToken = await this.accessTokenRepository.update(ci, newCs);
    
    return {
      ci: updatedToken.ci,
      cs: updatedToken.cs
    };
  }
}

module.exports = ManageAccessToken; 