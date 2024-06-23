import express from "express";
import { Kafka, logLevel } from "kafkajs";
import cors from "cors";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import farmaceuticoRoutes from "./routes/farmaceuticoRoutes.js";
import postoRoutes from "./routes/postoRoutes.js";

const app = express();

/**
 * Faz conexão com o Kafka
 */
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "request-group-receiver" });

/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  req.producer = producer;
  // req.consumer = consumer;
  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(express.json());
app.use(cors());
app.use("/api/medicamento", medicamentoRoutes);
app.use("/api/medico", medicoRoutes);
app.use("/api/farmaceutico", farmaceuticoRoutes);
app.use("/api/posto", postoRoutes);

const responses = {};

app.get("/subscribe/medicamento/get/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  responses[`medicamentoGetByCodigo:${codigo}`] = res;
});

app.get("/subscribe/:type/:id?", (req, res) => {
  const { type, id } = req.params;
  const key = id ? `${type}:${id}` : type;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  console.log("key:", key);
  responses[key] = res;
  res.on("close", () => {
    delete responses[key];
  });
});

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "responses" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { data, method } = JSON.parse(message.value.toString());
      console.log("Resposta", method);
      let key;
      switch (method.toString()) {
        case "medicamentoGetByCodigo":
          key = `${method}:${data.codigo}`;
          break;
        case "medicamentoGetAll":
          console.log("entrou");
          key = `medicamento:getAll`;
          console.log(key);
          break;
        default:
          key = `medico:create`;
          break;
      }
      const res = responses[key];
      if (res) {
        res.write(`data: ${JSON.stringify({ method, data })}\n\n`);
        delete responses[key];
      }
    },
  });

  app.listen(3333, () => {
    console.log("Server listening to port 3333");
  });
}

run().catch(console.error);
