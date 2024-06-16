import express from 'express';
import postoController from '../controllers/posto-controller.js';

const router = express.Router();

router
  .post('/', postoController.post)
  .get('/', postoController.getAll)
  .get('/:nome', postoController.getByNome)
  .put('/:nome', postoController.put)
  .delete('/:nome', postoController.delete);

export default router;

