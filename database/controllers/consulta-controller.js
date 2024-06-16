import mongoose from 'mongoose';
import Consulta from '../models/consulta.js;

const consultaController = {
  // Cria uma nova consulta
  post: async (req, res) => {
    try {
      const dados = req.body;

      const consulta = new Consulta(dados);
      await consulta.save();
      res.status(201).send({
        message: 'Consulta cadastrada com sucesso!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna todas as consultas
  getAll: async (req, res) => {
    try {
      const consultas = await Consulta.find({});
      res.status(200).send(consultas);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna todas as consultas de um determinado paciente
  getByPatient: async (req, res) => {
    try {
      const consultas = await Consulta.find({ 'codigo.paciente': req.params.paciente });
      res.status(200).send(consultas);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição getByPatient',
        error: error.message,
      });
    }
  },

  // Retorna consulta buscada pela tupla (medico, paciente, data)
  getByTuple: async (req, res) => {
    try {
      const consulta = await Consulta.findOne({
        'codigo.medico': req.body.codigo.medico,
        'codigo.paciente': req.body.codigo.paciente,
        'codigo.dataConsulta': req.body.codigo.dataConsulta,
      });
      if (!consulta) {
        return res.status(404).send({
          message: 'Consulta não encontrada',
        });
      }
      res.status(200).send(consulta);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição getByTuple',
        error: error.message,
      });
    }
  },

  // Atualiza uma consulta especifica pela tupla (medico, paciente, data)
  put: async (req, res) => {
    try {
      const result = await Consulta.updateOne(
        {
          'codigo.medico': req.body.codigo.medico,
          'codigo.paciente': req.body.codigo.paciente,
          'codigo.dataConsulta': req.body.codigo.dataConsulta,
        },
        { $set: req.body.newAppointment }
      );
      if (!result.nModified) {
        return res.status(404).send({
          message: 'Consulta não encontrada',
        });
      }
      res.status(200).send({
        message: 'Consulta atualizada com sucesso',
      });
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição updateAppointmentByTuple',
        error: error.message,
      });
    }
  },

  // Exclui uma consulta especifica pela tupla (medico, paciente, data)
  delete: async (req, res) => {
    try {
      const result = await Consulta.deleteOne({
        'codigo.medico': req.body.codigo.medico,
        'codigo.paciente': req.body.codigo.paciente,
        'codigo.dataConsulta': req.body.codigo.dataConsulta,
      });
      if (!result.deletedCount) {
        return res.status(404).send({
          message: 'Consulta não encontrada',
        });
      }
      res.status(200).send({
        message: 'Consulta removida com sucesso!',
      });
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao remover consulta',
        error: error.message,
      });
    }
  },
};

export default consultaController;

