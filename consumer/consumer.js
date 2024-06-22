import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "consumer-database",
});

import { connectDB } from "../database/connect.js";
import medicamentoController from "./controllers/medicamento-controller.js";

const topic = "requests";
const consumer = kafka.consumer({ groupId: "request-group" });

const producer = kafka.producer();

async function run() {
  // Connect the producer
  await connectDB();
  await producer.connect();

  // Connect the consumer
  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value).dados;
      const operation = JSON.parse(message.value).operation;
      // console.log(data);
      switch (operation) {
        case "CRIAR_REMEDIO":
          await medicamentoController.post(data, producer);
          break;
        case "GET_REMEDIO_COD":
          await medicamentoController.getByCodigo(data, producer);
          break;
        case "DELETE_REMEDIO_NOME":
          break;
      }
    },
  });
}

// Ensure proper error handling and graceful shutdown
run().catch(console.error);