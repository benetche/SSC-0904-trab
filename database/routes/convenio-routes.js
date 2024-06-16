import { Router } from "express";
import convenioController from "../controllers/convenio-controller.js";
const convenioRoutes = Router();

convenioRoutes.post("/convenio/create", convenioController.create);
// convenioRoutes.get("/user/getAll", pacienteController.getAll);

export default convenioRoutes;
