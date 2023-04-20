import { Router } from 'express';
import { SubscriberController } from '../controllers/index.js';
import { createSubscriberValidator } from '../validations.js';
import { checkValidationResults } from '../middlewares/index.js';

const router = new Router();

router.post('/', createSubscriberValidator, checkValidationResults, SubscriberController.create);

export default router;
