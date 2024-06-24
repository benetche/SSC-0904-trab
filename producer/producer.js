import express from "express";
import { Kafka, logLevel } from "kafkajs";
import cors from "cors";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import farmaceuticoRoutes from "./routes/farmaceuticoRoutes.js";
import postoRoutes from "./routes/postoRoutes.js";
import receitaRoutes from "./routes/receitaRoutes.js";
import promClient from 'prom-client'

const app = express();

/**
 * Faz conexão com o Kafka
 */
const kafka = new Kafka({
  clientId: "api",
  brokers: ["kafka:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "request-group-receiver" });

const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();

// Probe every 5th second.
collectDefaultMetrics({ register, timeout: 5000 });

// Create a custom counter metric for request operations
const requestCounter = new promClient.Counter({
  name: 'node_request_operations_total',
  help: 'Total number of requests',
  labelNames: ['method', 'route', 'code'],
});

// Register the custom metric
register.registerMetric(requestCounter);

// Endpoint to expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Register the custom metric
register.registerMetric(requestCounter);
/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
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
app.use("/api/receita", receitaRoutes);
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
          key = `medicamento:getAll`;
          break;
        case "medicoGetAll":
          key = "medico:getAll";
          break;
        case "receitaCreate":
          key = `receita:create`;
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
