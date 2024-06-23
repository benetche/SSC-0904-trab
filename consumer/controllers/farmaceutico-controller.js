import Farmaceutico from "../../database/models/farmaceutico.js";

const farmaceuticoController = {
  // Cria um novo farmacêutico

  post: async (data, producer) => {
    try {
      const dados = data;
      const farmaceutico = new Farmaceutico(dados);
      await farmaceutico.save();
      const message = {
        data: farmaceutico,
        method: `farmaceuticoCreate`,
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

export default farmaceuticoController;
