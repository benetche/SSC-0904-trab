import { Router } from "express";
import pacienteController from "../controllers/paciente-controller.js";
const pacienteRoutes = Router();

pacienteRoutes.post("/create", pacienteController.create);
pacienteRoutes.get("/getAll", pacienteController.getAll);

export default pacienteRoutes;
