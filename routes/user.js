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
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);
router.post('/verify-email/send', checkAuth, UserController.sendCodeToEmail);
router.post('/verify-email/:code', checkAuth, UserController.verifyEmail);
router.post('/verify-phone/send', checkAuth, UserController.sendCodeToPhone);
router.post('/verify-phone/:code', checkAuth, UserController.verifyPhone);
router.patch(
  '/',
  checkAuth,
  userUpdateValidator,
  checkExact(),
  checkValidationResults,
  UserController.update
);

export default router;
