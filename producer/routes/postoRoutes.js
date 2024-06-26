import express from "express";
import { CompressionTypes } from "kafkajs";
const postoRoutes = express.Router();

postoRoutes.post("/criar", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "CRIAR_POSTO",
    };
    // Chamar micro serviço
    await req.producer.send({
      topic: "requests",
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });

    return res.json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Falha ao processar requisição",
      error: error.message,
    });
  }
});

postoRoutes.get("/getByCodigo/:codigo", async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const message = {
      dados: codigo,
      operation: "GET_POSTO_CODIGO",
    };
    // Chamar micro serviço
    await req.producer.send({
      topic: "requests",
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });
    return res.json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Falha ao processar requisição",
      error: error.message,
    });
  }
});

postoRoutes.get("/farmaceutico/:cpf", async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const message = {
      dados: cpf,
      operation: "GET_POSTO_FARMACEUTICO",
    };
    // Chamar micro serviço
    await req.producer.send({
      topic: "requests",
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });
    return res.json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Falha ao processar requisição",
      error: error.message,
    });
  }
});

postoRoutes.put("/estoque/update", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "UPDATE_POSTO_ESTOQUE",
    };
    // Chamar micro serviço
    await req.producer.send({
      topic: "requests",
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });

    return res.json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Falha ao processar requisição",
      error: error.message,
    });
  }
});

export default postoRoutes;
