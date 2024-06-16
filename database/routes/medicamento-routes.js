import express from 'express';
import medicamentoController from '../controllers/medicamento-controller.js';

const router = express.Router();

router
  .post('/', medicamentoController.post)
  .get('/', medicamentoController.getAll)
  .get('/:codigo', medicamentoController.getByCodigo)
  .put('/:codigo', medicamentoController.put)
  .delete('/:codigo', medicamentoController.delete);

export default router;

