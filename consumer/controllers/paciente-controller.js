import Paciente from "../database/models/paciente.js";
import mongoose from "mongoose";

const pacienteController = {
  post: async (data, producer) => {
    const { cpf, nome, endereco, idade } = data;
    const paciente = new Paciente(data);

    try {
      await paciente.save();
      const message = {
        data: paciente,
        method: `pacienteCreate`,
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
      return console.error("Falha ao criar paciente.", error);
    }
  },
  getAll: async (data, producer) => {
    try {
      const pacientes = await Paciente.find({});

      const message = {
        data: pacientes,
        method: `pacientesGetAll`,
        query: "",
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
      return console.error("Falha ao buscar todos os pacientes.", error);
    }
  },
};

export default pacienteController;
