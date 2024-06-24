import { Kafka } from "kafkajs";
import { connectDB } from "./database/connect.js";
import medicamentoController from "./controllers/medicamento-controller.js";
import medicoController from "./controllers/medico-controller.js";
import farmaceuticoController from "./controllers/farmaceutico-controller.js";
import postoController from "./controllers/posto-controller.js";
import receitaController from "./controllers/receita-controller.js";
import promClient from 'prom-client'


// Config kafka
const kafka = new Kafka({
  brokers: ["kafka:9092"],
  clientId: "consumer-database",
});
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
      console.log(data, operation);
      switch (operation) {
        //Remedios
        case "CRIAR_REMEDIO":
          await medicamentoController.post(data, producer);
          break;
        case "GET_REMEDIO_COD":
          await medicamentoController.getByCodigo(data, producer);
          break;
        case "GET_REMEDIO_ALL":
          await medicamentoController.getAll(data, producer);
          break;
        //Medicos
        case "CRIAR_MEDICO":
          await medicoController.post(data, producer);
          break;
        case "GET_ALL_MEDICO":
          await medicoController.getAll(data, producer);
          break;
        // Farmaceutico
        case "CRIAR_FARMACEUTICO":
          await farmaceuticoController.post(data, producer);
          break;
        // Posto
        case "CRIAR_POSTO":
          await postoController.post(data, producer);
          break;
        case "GET_POSTO_NOME":
          await postoController.getByNome(data, producer);
          break;
        // Receita
        case "CRIAR_RECEITA":
          await receitaController.post(data, producer);
          break;
      }
    },
  });
}

// Ensure proper error handling and graceful shutdown
run().catch(console.error);
