import express from 'express';
import receitaController from '../controllers/receita-controller.js';

const router = express.Router();

router
  .post('/', receitaController.post)
  .get('/', receitaController.getAll)
  .get('/codigo/:codigo', receitaController.findPrescriptionByCode)
  .get('/paciente/:paciente', receitaController.findPrescriptionByPatient)
  .put('/codigo/:codigo', receitaController.updatePrescriptionByCode)
  .delete('/codigo/:codigo', receitaController.deletePrescriptionByCode);

export default router;

