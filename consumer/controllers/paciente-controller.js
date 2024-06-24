import Paciente from "../database/models/paciente.js";
import mongoose from "mongoose";

class PacienteController {
  async create(req, res) {
    const { cpf, nome, endereco, convenioMedico, idade } = req.body;

    try {
      const paciente = await Paciente.create({
        cpf,
        nome,
        endereco,
        convenioMedico,
        idade,
      });
      return res.json(paciente);
    } catch (error) {
      return res.status(500).send({
        error: "Falha ao criar paciente",
        message: error,
      });
    }
  }

  async getAll(req, res) {
    try {
      const pacientes = await Paciente.find({});

      res.status(200).json(pacientes);
    } catch (error) {
      res.status(500).send({
        error: "Falha ao buscar todos os pacientes",
        message: error,
      });
    }
  }
}

export default new PacienteController();
