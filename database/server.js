import express from "express";
import mongoose from 'mongoose';
import pacienteRoutes from './routes/paciente-routes.js';
import convenioRoutes from './routes/convenio-routes.js';
import consultaRoutes from './routes/consulta-routes.js';
import receitaRoutes from './routes/receita-routes.js';
import farmaceuticoRoutes from './routes/farmaceutico-routes.js';
import medicoRoutes from './routes/medico-routes.js';
import postoRoutes from './routes/posto-routes.js';
import medicamentoRoutes from './routes/medicamento-routes.js'; 


const DB_USER = "admin";
const DB_PASSWORD = "admin"
const DB_HOST = "localhost";
const DB_PORT = "27017";
const DB_NAME = "db";
const app = express();

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/convenios', convenioRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/receitas', receitaRoutes);
app.use('/api/farmaceuticos', farmaceuticoRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/postos', postoRoutes);
app.use('/api/medicamentos', medicamentoRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server listening to port:${port}`);
});
