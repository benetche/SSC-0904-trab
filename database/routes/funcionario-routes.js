import express from 'express';
import funcionarioController from '../controllers/funcionario-controller.js';
const router = express.Router();

router
  .post('/', funcionarioController.post)
  .get('/', funcionarioController.getAll)
  .get('/codigoRegional/:codigoRegional', funcionarioController.getByCodReg)
  .get('/uf/:uf', funcionarioController.getByUf)
  .put('/codigoRegional/:codigoRegional', funcionarioController.put)
  .delete('/codigoRegional/:codigoRegional', funcionarioController.delete);

export default router;
