import express from "express";
import { CompressionTypes } from "kafkajs";
const pacienteRoutes = express.Router();

pacienteRoutes.get("/getAll", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "GET_PACIENTE_ALL",
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

pacienteRoutes.post("/criar", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "CRIAR_PACIENTE",
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

export default pacienteRoutes;
