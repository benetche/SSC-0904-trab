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

postoRoutes.get("/getByNome/:nome", async (req, res) => {
  try {
    const nome = req.params.nome;
    const message = {
      dados: nome,
      operation: "GET_POSTO_NOME",
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
