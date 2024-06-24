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
  getByNome: async (data, producer) => {
    try {
      const nome = data;

      const posto = await Posto.findOne({ nome: nome })
        .populate("farmaceuticos")
        .populate("medicos")
        .populate("estoque.medicamentos");
      console.log(posto);
      if (!posto) {
        return new Error({ message: "Posto não encontrado" });
      }
      const message = {
        data: posto,
        method: `postoGetByNome`,
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
};

export default postoController;
