import mongoose from "mongoose";
import Receita from "../../database/models/receita.js";
const receitaController = {
  // Cria uma nova receita
  post: async (req, res) => {
    try {
      const dados = req.body;

      const receita = new Receita(dados);

      await receita.save();
      res.status(201).send({
        message: "Receita cadastrada com sucesso",
      });
    } catch (error) {
      res.status(500).send({
        message: "Falha ao processar requisição post",
        error: error.message,
      });
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
