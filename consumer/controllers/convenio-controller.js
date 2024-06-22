import Convenio from "../../database/models/convenio.js";

class ConvenioController {
  async create(req, res) {
    const { cnpj, nome, cobertura } = req.body;

    try {
      const convenio = await Convenio.create({
        cnpj,
        nome,
        cobertura,
      });
      return res.status(201).json(convenio);
    } catch (error) {
      return res.status(501).send({
        error: "Erro ao criar convenio",
        message: error,
      });
    }
  }
}

export default new ConvenioController();
