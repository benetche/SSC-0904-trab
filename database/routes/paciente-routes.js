import { Router } from "express";
import pacienteController from "../controllers/paciente-controller.js";
const pacienteRoutes = Router();

pacienteRoutes.post("/user/create", pacienteController.create);
pacienteRoutes.get("/user/getAll", pacienteController.getAll);

export default pacienteRoutes;
