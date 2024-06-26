import { Kafka } from "kafkajs";
import { connectDB } from "./database/connect.js";
import medicamentoController from "./controllers/medicamento-controller.js";
import medicoController from "./controllers/medico-controller.js";
import farmaceuticoController from "./controllers/farmaceutico-controller.js";
import postoController from "./controllers/posto-controller.js";
import receitaController from "./controllers/receita-controller.js";
import pacienteController from "./controllers/paciente-controller.js";

// Config kafka
const kafka = new Kafka({
  brokers: ["kafka:9092"],
  clientId: "consumer-database",
});
const topic = "requests";
const consumer = kafka.consumer({ groupId: "request-group" });
const producer = kafka.producer();

const operationHandlers = {
  // Pacientes
  CRIAR_PACIENTE: pacienteController.post,
  GET_PACIENTE_ALL: pacienteController.getAll,
  // Remedios
  CRIAR_REMEDIO: medicamentoController.post,
  GET_REMEDIO_COD: medicamentoController.getByCodigo,
  GET_REMEDIO_ALL: medicamentoController.getAll,
  // Medicos
  CRIAR_MEDICO: medicoController.post,
  GET_ALL_MEDICO: medicoController.getAll,
  // Farmaceutico
  CRIAR_FARMACEUTICO: farmaceuticoController.post,
  // Posto
  CRIAR_POSTO: postoController.post,
  GET_POSTO_CODIGO: postoController.getByCodigo,
  GET_POSTO_FARMACEUTICO: postoController.getPostoFarmaceutico,
  UPDATE_POSTO_ESTOQUE: postoController.updatePostoEstoque,
  // Receita
  CRIAR_RECEITA: receitaController.post,
  GET_RECEITA_ALL: receitaController.getAll,
};

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
      const handler = operationHandlers[operation];
      if (handler) {
        await handler(data, producer);
      } else {
        console.error(`Operation ${operation} not supported.`);
      }
    },
  });
}

// Ensure proper error handling and graceful shutdown
run().catch(console.error);
