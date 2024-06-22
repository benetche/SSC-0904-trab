import Farmaceutico from "../../database/models/farmaceutico.js";

const farmaceuticoController = {
  // Cria um novo farmacêutico
  post: async (req, res) => {
    try {
      const dados = req.body;
      const farmaceutico = new Farmaceutico(dados);
      await farmaceutico.save();
      res.status(201).json({
        message: "Farmacêutico cadastrado com sucesso!",
        farmaceutico,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna todos os farmacêuticos
  getAll: async (req, res) => {
    try {
      const farmaceuticos = await Farmaceutico.find({});
      res.status(200).json(farmaceuticos);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna um farmacêutico pelo CPF
  getByCpf: async (req, res) => {
    try {
      const farmaceutico = await Farmaceutico.findOne({ cpf: req.params.cpf });
      if (!farmaceutico) {
        return res.status(404).json({
          message: "Farmacêutico não encontrado",
        });
      }
      res.status(200).json(farmaceutico);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição getByCpf",
        error: error.message,
      });
    }
  },

  // Atualiza um farmacêutico pelo CPF
  put: async (req, res) => {
    try {
      const farmaceutico = await Farmaceutico.findOneAndUpdate(
        { cpf: req.params.cpf },
        { $set: req.body },
        { new: true }
      );
      if (!farmaceutico) {
        return res.status(404).json({
          message: "Farmacêutico não encontrado",
        });
      }
      res.status(200).json({
        message: "Farmacêutico atualizado com sucesso",
        farmaceutico,
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição updateByCpf",
        error: error.message,
      });
    }
  },

  // Exclui um farmacêutico pelo CPF
  delete: async (req, res) => {
    try {
      const farmaceutico = await Farmaceutico.findOneAndDelete({
        cpf: req.params.cpf,
      });
      if (!farmaceutico) {
        return res.status(404).json({
          message: "Farmacêutico não encontrado",
        });
      }
      res.status(200).json({
        message: "Farmacêutico removido com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao remover farmacêutico",
        error: error.message,
      });
    }
  },
};

export default farmaceuticoController;
