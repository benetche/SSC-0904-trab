import express from 'express';
import medicoController from '../controllers/medico-controller.js';

const router = express.Router();

router
  .post('/', medicoController.post)
  .get('/', medicoController.getAll)
  .get('/:cpf', medicoController.getByCpf)
  .put('/:cpf', medicoController.put)
  .delete('/:cpf', medicoController.delete);

export default router;

