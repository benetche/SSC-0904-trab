import express from "express";
import { CompressionTypes } from "kafkajs";
const medicoRoutes = express.Router();

medicoRoutes.post("/criar", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "CRIAR_MEDICO",
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

medicoRoutes.get("/getAll", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "GET_ALL_MEDICO",
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

export default medicoRoutes;
