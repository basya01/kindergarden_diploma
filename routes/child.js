import { Router } from 'express';
import { ChildController } from '../controllers/index.js';
import {
  checkAuth,
  checkChildBelongsUser,
  checkValidationResults,
} from '../middlewares/index.js';
import { createChildValidator } from '../validations.js';

const router = new Router();
router.post(
  '/',
  checkAuth,
  createChildValidator,
  checkValidationResults,
  ChildController.create
);
router.post('/book', checkAuth, checkChildBelongsUser, ChildController.addBook);
router.patch('/book', checkAuth, checkChildBelongsUser, ChildController.updateChildBook);

export default router;
