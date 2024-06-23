import Medico from "../../database/models/medico.js";

const medicoController = {
  // Cria um novo médico
  post: async (data, producer) => {
    try {
      const dados = data;
      const medico = new Medico(dados);
      await medico.save();
      const message = {
        data: medico,
        method: `medicoCreate`,
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

  getAll: async (data, producer) => {
    try {
      const medicos = await Medico.find({});
      const message = {
        data: medicos,
        method: `medicoGetAll`,
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

export default medicoController;
