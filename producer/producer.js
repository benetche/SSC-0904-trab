import express from "express";
import { Kafka, logLevel } from "kafkajs";
import cors from "cors";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import farmaceuticoRoutes from "./routes/farmaceuticoRoutes.js";
import postoRoutes from "./routes/postoRoutes.js";
import receitaRoutes from "./routes/receitaRoutes.js";
import promClient from "prom-client";
import pacienteRoutes from "./routes/pacienteRoutes.js";

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

collectDefaultMetrics({ register, timeout: 5000 });

// Create custom metrics
const requestCounter = new promClient.Counter({
  name: "node_request_operations_total",
  help: "Total number of requests",
  labelNames: ["method", "route", "code"],
});

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000, 10000], // 0.1ms to 10s
});

register.registerMetric(requestCounter);
register.registerMetric(httpRequestDurationMicroseconds);

// Endpoint to expose metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
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
app.use("/api/pacientes", pacienteRoutes);
const responses = {};

// rotas subscribe
app.get("/subscribe/:type/:action/:id?", (req, res) => {
  const { type, action, id } = req.params;
  const key = id
    ? `${type}${action.charAt(0).toUpperCase() + action.slice(1)}:${id}`
    : `${type}${action.charAt(0).toUpperCase() + action.slice(1)}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  console.log("KEY =", key);

  responses[key] = res;
  res.on("close", () => {
    delete responses[key];
  });
});

const methodKeyMappings = {
  medicamentoGetByCodigo: (query) => `medicamentoGet:${query}`,
  medicamentoGetAll: () => "medicamentoGetAll",
  medicoGetAll: () => "medicoGetAll",
  receitaCreate: () => "receitaCreate",
  receitaGetAll: () => "receitaGetAll",
  postoGetByCodigo: (query) => `postoGetByCodigo:${query}`,
  pacientesGetAll: () => "pacientesGetAll",
};

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "responses" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { data, method, query } = JSON.parse(message.value.toString());
      console.log("Resposta", method, " query ", query);
      const getKey = methodKeyMappings[method] || (() => "medico:create");
      const key = getKey(query);
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
