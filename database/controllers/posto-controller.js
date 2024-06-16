import Posto from '../models/posto.js';

const postoController = {
  // Cria um novo posto
  post: async (req, res) => {
    try {
      const dados = req.body;
      const posto = new Posto(dados);
      await posto.save();
      res.status(201).json({
        message: 'Posto cadastrado com sucesso!',
        posto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna todos os postos
  getAll: async (req, res) => {
    try {
      const postos = await Posto.find({})
        .populate('farmaceuticos')
        .populate('medicos')
        .populate('estoque.medicamentos');
      res.status(200).json(postos);
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna um posto pelo nome
  getByNome: async (req, res) => {
    try {
      const posto = await Posto.findOne({ nome: req.params.nome })
        .populate('farmaceuticos')
        .populate('medicos')
        .populate('estoque.medicamentos');
      if (!posto) {
        return res.status(404).json({
          message: 'Posto não encontrado',
        });
      }
      res.status(200).json(posto);
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao processar requisição getByNome',
        error: error.message,
      });
    }
  },

  // Atualiza um posto pelo nome
  put: async (req, res) => {
    try {
      const posto = await Posto.findOneAndUpdate(
        { nome: req.params.nome },
        { $set: req.body },
        { new: true }
      )
        .populate('farmaceuticos')
        .populate('medicos')
        .populate('estoque.medicamentos');
      if (!posto) {
        return res.status(404).json({
          message: 'Posto não encontrado',
        });
      }
      res.status(200).json({
        message: 'Posto atualizado com sucesso',
        posto,
      });
    } catch (error) {
      res.status500().json({
        message: 'Falha ao processar requisição updateByNome',
        error: error.message,
      });
    }
  },

  // Exclui um posto pelo nome
  delete: async (req, res) => {
    try {
      const posto = await Posto.findOneAndDelete({ nome: req.params.nome });
      if (!posto) {
        return res.status(404).json({
          message: 'Posto não encontrado',
        });
      }
      res.status(200).json({
        message: 'Posto removido com sucesso!',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao remover posto',
        error: error.message,
      });
    }
  },
};

export default postoController;

