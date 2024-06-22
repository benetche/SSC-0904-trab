import Medicamento from "../../database/models/medicamento.js";

const medicamentoController = {
  // Cria um novo medicamento
  post: async (data, producer) => {
    try {
      const dados = data;
      const medicamento = new Medicamento(dados);
      await medicamento.save();
      await producer.send({
        topic: "responses",
        messages: [
          {
            value: `Medicamento ${dados} criado`,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  },

  // Retorna todos os medicamentos
  getAll: async (data, producer) => {
    try {
      const medicamentos = await Medicamento.find({});
      res.status(200).json(medicamentos);
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição",
        error: error.message,
      });
    }
  },

  // Retorna um medicamento pelo código
  getByCodigo: async (data, producer) => {
    try {
      const medicamento = await Medicamento.findOne({
        codigo: data,
      });
      if (!medicamento) {
        console.log("Medicamento não encontrado");
      } else {
        const message = {
          medicamento: medicamento,
        };
        await producer.send({
          topic: "responses",
          messages: [
            {
              value: JSON.stringify(message),
            },
          ],
        });
      }
    } catch (error) {
      console.error({ message: "Erro em getByCodigo" });
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
          message: "Medicamento não encontrado",
        });
      }
      res.status(200).json({
        message: "Medicamento atualizado com sucesso",
        medicamento,
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao processar requisição updateByCodigo",
        error: error.message,
      });
    }
  },

  // Exclui um medicamento pelo código
  delete: async (req, res) => {
    try {
      const medicamento = await Medicamento.findOneAndDelete({
        codigo: req.params.codigo,
      });
      if (!medicamento) {
        return res.status(404).json({
          message: "Medicamento não encontrado",
        });
      }
      res.status(200).json({
        message: "Medicamento removido com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Falha ao remover medicamento",
        error: error.message,
      });
    }
  },
};

export default medicamentoController;
