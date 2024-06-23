import Farmaceutico from "../../database/models/farmaceutico.js";
import Medicamento from "../../database/models/medicamento.js";
import Medico from "../../database/models/medico.js";
import Posto from "../../database/models/posto.js";

const postoController = {
  // Cria um novo posto
  post: async (data, producer) => {
    try {
      const { nome, farmaceuticos, medicos, estoque } = data;
      const farmaceutico = await Farmaceutico.findOne({ cpf: farmaceuticos });
      const medico = await Medico.findOne({ cpf: medicos });
      const medicamento = await Medicamento.findOne({
        codigo: estoque.medicamento,
      });
      const quant = estoque.quantidade;
      const posto = new Posto({
        nome,
        farmaceuticos: farmaceutico._id,
        medicos: medico._id,
        estoque: {
          medicamentos: medicamento._id,
          quantidade: quant,
        },
      });
      await posto.save();
      const message = {
        data: posto,
        method: `postoCreate`,
      };
      await producer.send({
        topic: "responses",
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  },

  // Retorna todos os postos
  getAll: async (req, res) => {
    try {
      const postos = await Posto.find({})
        .populate("farmaceuticos")
        .populate("medicos")
        .populate("estoque.medicamentos");
      res.status(200).json(postos);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna um posto pelo nome
  getByNome: async (req, res) => {
    try {
      const posto = await Posto.findOne({ nome: req.params.nome })
        .populate("farmaceuticos")
        .populate("medicos")
        .populate("estoque.medicamentos");
      if (!posto) {
        return res.status(404).json({
          message: "Posto não encontrado",
        });
      }
      res.status(200).json(posto);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição getByNome",
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
        .populate("farmaceuticos")
        .populate("medicos")
        .populate("estoque.medicamentos");
      if (!posto) {
        return res.status(404).json({
          message: "Posto não encontrado",
        });
      }
      res.status(200).json({
        message: "Posto atualizado com sucesso",
        posto,
      });
    } catch (error) {
      res.status500().json({
        message: "Falha ao processar requisição updateByNome",
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
          message: "Posto não encontrado",
        });
      }
      res.status(200).json({
        message: "Posto removido com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao remover posto",
        error: error.message,
      });
    }
  },
};

export default postoController;
