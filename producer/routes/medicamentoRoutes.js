import express from "express";
import { CompressionTypes } from "kafkajs";
import generateUniqueId from "../utils/correlationId.js";
const medicamentoRoutes = express.Router();

medicamentoRoutes.post("/criar", async (req, res) => {
  try {
    const dados = req.body;
    const message = {
      dados: dados,
      operation: "CRIAR_REMEDIO",
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

medicamentoRoutes.get("/get/:codigo", async (req, res) => {
  try {
    const dados = req.params.codigo;
    const message = {
      dados: dados,
      operation: "GET_REMEDIO_COD",
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

// medicamentoRoutes.delete("/delete", async (req, res) => {
//   try {
//     const dados = req.body;
//     const message = {
//       dados: dados,
//       operation: "DELETE_REMEDIO_NOME",
//     };
//     // Chamar micro serviço
//     await req.producer.send({
//       topic: "requests",
//       compression: CompressionTypes.GZIP,
//       messages: [{ value: JSON.stringify(message) }],
//     });
//     return res.json({ message: "ok" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Falha ao processar requisição",
//       error: error.message,
//     });
//   }
// });

export default medicamentoRoutes;
