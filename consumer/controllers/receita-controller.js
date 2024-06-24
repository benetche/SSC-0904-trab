import mongoose from "mongoose";
import Receita from "../database/models/receita.js";
import Paciente from "../database/models/paciente.js";
import Medico from "../database/models/medico.js";
import Medicamento from "../database/models/medicamento.js";

function generateUniqueId() {
  const timestamp = new Date().getTime(); // Obtém o timestamp atual em milissegundos
  const randomNum = Math.floor(Math.random() * 1000); // Gera um número aleatório entre 0 e 999

  return `${timestamp}_${randomNum}`;
}

const receitaController = {
  // Cria uma nova receita
  post: async (data, producer) => {
    try {
      const { paciente, receituario, medico, validade } = data;
      // const receita = new Receita(dados);
      const { medicamento, frequencia, dose } = receituario;
      const pacienteCheck = await Paciente.findOne({ cpf: paciente });
      const medicoCheck = await Medico.findOne({ cpf: medico });
      const medicamentoCheck = await Medicamento.findOne({
        codigo: medicamento,
      });
      const receita = new Receita({
        cod_receita: generateUniqueId(),
        paciente: pacienteCheck._id,
        receituario: {
          medicamento: medicamentoCheck._id,
          dose: dose,
          frequencia: frequencia,
        },
        medico: medicoCheck._id,
        validade: validade,
      });

      await receita.save();
      const message = {
        data: receita,
        method: `receitaCreate`,
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
      const receita = await Receita.find({})
        .populate("medico")
        .populate("paciente")
        .populate("receituario.medicamento");
      console.log("RECEITA ENCONTRADA: ", receita);
      const message = {
        data: receita,
        method: `receitaGetAll`,
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
      console.error({ message: "Erro em receitaGetAll" });
    }
  },
};

export default receitaController;
