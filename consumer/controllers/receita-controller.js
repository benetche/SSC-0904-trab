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

  // Busca uma receita pelo código
  findPrescriptionByCode: async (req, res) => {
    try {
      const receita = await Receita.findOne({
        cod_receita: req.params.codigo,
      }).populate("medico paciente receituario.medicamento");

      if (!receita) {
        return res.status(404).send({
          message: "Receita não encontrada",
        });
      }

      res.status(200).send(receita);
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição findPrescriptionByCode",
        error: error.message,
      });
    }
  },

  // Retorna todas as receitas
  getAll: async (req, res) => {
    try {
      const receitas = await Receita.find({}).populate(
        "medico paciente receituario.medicamento"
      );
      res.status(200).send(receitas);
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição getAll",
        error: error.message,
      });
    }
  },

  // Busca receitas pelo ID do paciente
  findPrescriptionByPatient: async (req, res) => {
    try {
      const receitas = await Receita.find({
        paciente: req.params.paciente,
      }).populate("medico paciente receituario.medicamento");

      res.status(200).send(receitas);
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição findPrescriptionByPatient",
        error: error.message,
      });
    }
  },

  // Atualiza uma receita pelo código
  updatePrescriptionByCode: async (req, res) => {
    try {
      const receita = await Receita.findOneAndUpdate(
        {
          cod_receita: req.params.codigo,
        },
        { $set: req.body },
        { new: true }
      ).populate("medico paciente receituario.medicamento");

      if (!receita) {
        return res.status(404).send({
          message: "Receita não encontrada",
        });
      }

      res.status(200).send({
        message: "Receita atualizada com sucesso",
        receita,
      });
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição updatePrescriptionByCode",
        error: error.message,
      });
    }
  },

  // Deleta uma receita pelo código
  deletePrescriptionByCode: async (req, res) => {
    try {
      const receita = await Receita.findOneAndDelete({
        cod_receita: req.params.codigo,
      });

      if (!receita) {
        return res.status(404).send({
          message: "Receita não encontrada",
        });
      }

      res.status(200).send({
        message: "Receita deletada com sucesso",
      });
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição deletePrescriptionByCode",
        error: error.message,
      });
    }
  },
};

export default receitaController;
