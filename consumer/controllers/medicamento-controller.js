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
    console.log("requisição getall");
    try {
      const medicamentos = await Medicamento.find({});
      const message = {
        data: medicamentos,
        method: `medicamentoGetAll`,
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
      console.error({ message: "Erro em medicamentGetAll" });
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
          data: medicamento,
          method: `medicamentoGetByCodigo`,
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
      console.error({ message: "Erro em medicamentoGetByCodigo" });
    }
  },
};

export default medicamentoController;
