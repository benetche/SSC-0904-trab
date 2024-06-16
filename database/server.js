import express from "express";
import mongoose from "mongoose";
import pacienteRoutes from "./routes/paciente-routes.js";
import convenioRoutes from "./routes/convenio-routes.js";

const DB_USER = "admin";
const DB_PASSWORD = "admin";
const DB_HOST = "db";
const DB_PORT = "27017";
const DB_NAME = "db";
const app = express();

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(URI);
app.use(express.json());

app.use([pacienteRoutes, convenioRoutes]);

const port = 3001;

app.listen(port, () => {
  console.log(`Server listening to port:${port}`);
});
