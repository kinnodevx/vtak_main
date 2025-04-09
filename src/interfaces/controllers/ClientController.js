const crypto = require('crypto');
const AccessTokenRepository = require('../../infrastructure/repositories/AccessTokenRepository');

class ClientController {
  constructor() {
    this.accessTokenRepository = new AccessTokenRepository();
  }

  async registerClient(req, res) {
    try {
      const { agent } = req.body;
      
      if (!agent) {
        return res.status(400).json({ error: 'O parâmetro agent é obrigatório' });
      }

      // Verificar se o usuário é administrador
      if (!req.user || req.user.role_id !== 1) {
        return res.status(403).json({ error: 'Apenas administradores podem gerar chaves de API' });
      }

      // Gerar CI e CS
      const ci = `api_${crypto.randomBytes(16).toString('hex')}`;
      const cs = `secret_${crypto.randomBytes(32).toString('hex')}`;
      
      // Salvar no banco de dados
      const token = await this.accessTokenRepository.create(ci, cs, agent);

      // Retornar para o cliente
      return res.status(201).json({
        message: 'Chaves de API geradas com sucesso',
        credentials: {
          clientId: ci,
          clientSecret: cs,
          agent: agent,
          createdAt: token.created_at
        },
        instructions: 'Forneça estas credenciais para aplicações cliente utilizarem nas requisições de registro e login nos cabeçalhos X-Client-ID e X-Client-Secret'
      });
    } catch (error) {
      console.error('Erro ao gerar chaves de API:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listClients(req, res) {
    try {
      // Verificar se o usuário é administrador
      if (!req.user || req.user.role_id !== 1) {
        return res.status(403).json({ error: 'Apenas administradores podem listar chaves de API' });
      }

      const clients = await this.accessTokenRepository.findAll();
      
      return res.json(clients.map(client => ({
        id: client.id,
        clientId: client.ci,
        createdAt: client.created_at,
        updatedAt: client.updated_at
      })));
    } catch (error) {
      console.error('Erro ao listar chaves de API:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteClient(req, res) {
    try {
      const { clientId } = req.params;

      // Verificar se o usuário é administrador
      if (!req.user || req.user.role_id !== 1) {
        return res.status(403).json({ error: 'Apenas administradores podem revogar chaves de API' });
      }

      await this.accessTokenRepository.delete(clientId);
      
      return res.json({ message: 'Chave de API revogada com sucesso' });
    } catch (error) {
      console.error('Erro ao revogar chave de API:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = ClientController; 