import mongoose from 'mongoose';
import Funcionario from '../models/funcionario.js';
const funcionarioController = {
  // Cria um novo funcionário
  post: async (req, res) => {
    try {
      const dados = req.body;
      const funcionario = new Funcionario(dados);
      await funcionario.save();
      res.status(201).send({
        message: 'Funcionário cadastrado com sucesso!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna todos os funcionários
  getAll: async (req, res) => {
    try {
      const funcionarios = await Funcionario.find({});
      res.status(200).send(funcionarios);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição',
        error: error.message,
      });
    }
  },

  // Retorna um funcionário pelo código regional
  getByCodReg: async (req, res) => {
    try {
      const funcionario = await Funcionario.findOne({ codigoRegional: req.params.codigoRegional });
      if (!funcionario) {
        return res.status(404).send({
          message: 'Funcionário não encontrado',
        });
      }
      res.status(200).send(funcionario);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição getByCodReg',
        error: error.message,
      });
    }
  },

  // Retorna todos os funcionários de um estado (UF)
  getByUf: async (req, res) => {
    try {
      const funcionarios = await Funcionario.find({ uf: req.params.uf });
      res.status(200).send(funcionarios);
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição getByUf',
        error: error.message,
      });
    }
  },

  // Atualiza um funcionário pelo código regional
  put: async (req, res) => {
    try {
      const funcionario = await Funcionario.findOneAndUpdate(
        { codigoRegional: req.params.codigoRegional },
        { $set: req.body },
        { new: true }
      );
      if (!funcionario) {
        return res.status(404).send({
          message: 'Funcionário não encontrado',
        });
      }
      res.status(200).send({
        message: 'Funcionário atualizado com sucesso',
        funcionario,
      });
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao processar requisição updateWorkerByCodReg',
        error: error.message,
      });
    }
  },

  // Exclui um funcionário pelo código regional
  delete: async (req, res) => {
    try {
      const funcionario = await Funcionario.findOneAndDelete({ codigoRegional: req.params.codigoRegional });
      if (!funcionario) {
        return res.status(404).send({
          message: 'Funcionário não encontrado',
        });
      }
      res.status(200).send({
        message: 'Funcionário removido com sucesso!',
      });
    } catch (error) {
      res.status(500).send({
        message: 'Falha ao remover funcionário',
        error: error.message,
      });
    }
  },
};

export default funcionarioController;

