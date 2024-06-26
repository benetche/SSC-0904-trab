import Farmaceutico from "../database/models/farmaceutico.js";
import Medicamento from "../database/models/medicamento.js";
import Medico from "../database/models/medico.js";
import Posto from "../database/models/posto.js";

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

  // Retorna um posto pelo nome
  getByCodigo: async (data, producer) => {
    try {
      const codigo = data;

      const posto = await Posto.findOne({ codigo: codigo })
        .populate("farmaceuticos")
        .populate("medicos")
        .populate("estoque.medicamento");
      if (!posto) {
        return new Error({ message: "Posto não encontrado" });
      }
      const message = {
        data: posto,
        query: codigo,
        method: `postoGetByCodigo`,
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

  getPostoFarmaceutico: async (data, producer) => {
    try {
      const cpf = data;
      const farmaceutico = await Farmaceutico.findOne({ cpf });

      if (!farmaceutico) {
        return console.error({ message: "Farmaceutico não encontrado" });
      }
      const posto = await Posto.findOne({
        farmaceuticos: farmaceutico._id,
      }).populate("farmaceuticos");

      const message = {
        data: posto,
        method: `postoGetFarmaceutico`,
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

  updatePostoEstoque: async (data, producer) => {
    try {
      const { posto, medicamento, quantidade } = data;
      console.log(posto, ",", medicamento, ",", quantidade);
      const postoExists = await Posto.findOne({ codigo: posto }).populate(
        "estoque.medicamento"
      );
      if (!postoExists) {
        return console.error({ message: "Posto não encontrado" });
      }
      const medicamentoIndex = postoExists.estoque.findIndex(
        (item) => item.medicamento.codigo === medicamento
      );
      if (medicamentoIndex === -1) {
        console.error("Medicamento not found in posto estoque.");
        return;
      }

      postoExists.estoque[medicamentoIndex].quantidade = quantidade;
      await postoExists.save();
    } catch (error) {
      console.error(error);
    }
  },
};

export default postoController;
