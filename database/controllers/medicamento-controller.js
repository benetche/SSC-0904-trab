import Medicamento from '../models/medicamento.js';

const medicamentoController = {
  // Cria um novo medicamento
  post: async (req, res) => {
    try {
      const dados = req.body;
      const medicamento = new Medicamento(dados);
      await medicamento.save();
      res.status(201).json({
        message: 'Medicamento cadastrado com sucesso!',
        medicamento,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna todos os medicamentos
  getAll: async (req, res) => {
    try {
      const medicamentos = await Medicamento.find({});
      res.status(200).json(medicamentos);
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna um medicamento pelo código
  getByCodigo: async (req, res) => {
    try {
      const medicamento = await Medicamento.findOne({ codigo: req.params.codigo });
      if (!medicamento) {
        return res.status(404).json({
          message: 'Medicamento não encontrado',
        });
      }
      res.status(200).json(medicamento);
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao processar requisição getByCodigo',
        error: error.message,
      });
    }
  },

  // Atualiza um medicamento pelo código
  put: async (req, res) => {
    try {
      const medicamento = await Medicamento.findOneAndUpdate(
        { codigo: req.params.codigo },
        { $set: req.body },
        { new: true }
      );
      if (!medicamento) {
        return res.status(404).json({
          message: 'Medicamento não encontrado',
        });
      }
      res.status(200).json({
        message: 'Medicamento atualizado com sucesso',
        medicamento,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao processar requisição updateByCodigo',
        error: error.message,
      });
    }
  },

  // Exclui um medicamento pelo código
  delete: async (req, res) => {
    try {
      const medicamento = await Medicamento.findOneAndDelete({ codigo: req.params.codigo });
      if (!medicamento) {
        return res.status(404).json({
          message: 'Medicamento não encontrado',
        });
      }
      res.status(200).json({
        message: 'Medicamento removido com sucesso!',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Falha ao remover medicamento',
        error: error.message,
      });
    }
  },
};

export default medicamentoController;

