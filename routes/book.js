import { Router } from 'express';
import { BookController } from '../controllers/index.js';

const router = new Router();

router.get('/', BookController.getAll);
router.get('/:id', BookController.getOne);

export default router;
