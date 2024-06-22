import Medico from "../../database/models/medico.js";

const medicoController = {
  // Cria um novo médico
  post: async (req, res) => {
    try {
      const dados = req.body;
      const medico = new Medico(dados);
      await medico.save();
      res.status(201).json({
        message: "Médico cadastrado com sucesso!",
        medico,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna todos os médicos
  getAll: async (req, res) => {
    try {
      const medicos = await Medico.find({});
      res.status(200).json(medicos);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna um médico pelo CPF
  getByCpf: async (req, res) => {
    try {
      const medico = await Medico.findOne({ cpf: req.params.cpf });
      if (!medico) {
        return res.status(404).json({
          message: "Médico não encontrado",
        });
      }
      res.status(200).json(medico);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição getByCpf",
        error: error.message,
      });
    }
  },

  // Atualiza um médico pelo CPF
  put: async (req, res) => {
    try {
      const medico = await Medico.findOneAndUpdate(
        { cpf: req.params.cpf },
        { $set: req.body },
        { new: true }
      );
      if (!medico) {
        return res.status(404).json({
          message: "Médico não encontrado",
        });
      }
      res.status(200).json({
        message: "Médico atualizado com sucesso",
        medico,
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição updateByCpf",
        error: error.message,
      });
    }
  },

  // Exclui um médico pelo CPF
  delete: async (req, res) => {
    try {
      const medico = await Medico.findOneAndDelete({ cpf: req.params.cpf });
      if (!medico) {
        return res.status(404).json({
          message: "Médico não encontrado",
        });
      }
      res.status(200).json({
        message: "Médico removido com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao remover médico",
        error: error.message,
      });
    }
  },
};

export default medicoController;
