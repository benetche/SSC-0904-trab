import express from 'express';
import farmaceuticoController from '../controllers/farmaceutico-controller.js';

const router = express.Router();

router
  .post('/', farmaceuticoController.post)
  .get('/', farmaceuticoController.getAll)
  .get('/:cpf', farmaceuticoController.getByCpf)
  .put('/:cpf', farmaceuticoController.put)
  .delete('/:cpf', farmaceuticoController.delete);

export default router;

