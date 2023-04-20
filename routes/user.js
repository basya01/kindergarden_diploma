import { Router } from 'express';
import { UserController } from '../controllers/index.js';
import {
  registerValidator,
  loginValidator,
  userUpdateValidator,
} from '../validations.js';
import {
  checkValidationResults,
  checkPhoneOrEmail,
  checkAuth,
} from '../middlewares/index.js';
import { checkExact } from 'express-validator';
const router = new Router();

router.get('/', UserController.getAll);
router.get('/me', checkAuth, UserController.getMe);
router.get('/:id', UserController.getOne);
router.post(
  '/register',
  registerValidator,
  checkValidationResults,
  UserController.register
);
router.post(
  '/login',
  checkPhoneOrEmail,
  loginValidator,
  checkValidationResults,
  UserController.login
);
router.patch(
  '/',
  checkAuth,
  userUpdateValidator,
  checkExact(),
  checkValidationResults,
  UserController.update
);

export default router;