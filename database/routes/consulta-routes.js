import express from 'express';
import consultaController from '../controllers/consulta-controller.js';
const router = express.Router();

router
  .post('/', consultaController.post)
  .get('/', consultaController.getAll)
  .get('/paciente/:paciente', consultaController.getByPatient)
  .post('/tuple', consultaController.getByTuple)
  .put('/tuple', consultaController.put)
  .delete('/tuple', consultaController.delete);

export default router;
