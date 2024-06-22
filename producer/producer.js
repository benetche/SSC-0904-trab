import express from "express";
import { Kafka, logLevel } from "kafkajs";

import medicamentoRoutes from "./routes/medicamentoRoutes.js";

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
app.use("/api/medicamento", medicamentoRoutes);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "responses" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Resposta", String(message.value));
    },
  });

  app.listen(3333, () => {
    console.log("Server listening to port 3333");
  });
}

run().catch(console.error);
