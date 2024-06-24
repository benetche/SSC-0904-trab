import mongoose from "mongoose";

import "./models/consulta.js";
import "./models/convenio.js";
import "./models/farmaceutico.js";
import "./models/medicamento.js";
import "./models/medico.js";
import "./models/paciente.js";
import "./models/posto.js";
import "./models/receita.js";
const DB_USER = "admin";
const DB_PASSWORD = "admin";
const DB_HOST = "db";
const DB_PORT = "27017";
const DB_NAME = "db";
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

export const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
