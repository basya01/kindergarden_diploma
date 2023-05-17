import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('Некоректний email'),
  body('firstName')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage("Ім'я має містити від 2 до 20 символів"),
  body('lastName')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Фамілія має містити від 2 до 20 символів'),
  body('password')
    .isStrongPassword({
      minLength: 4,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      returnScore: false,
    })
    .withMessage('Пароль має містити від 4 символів'),
  // body('photo').optional().isURL().withMessage('Photo must be URL'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('It is not similar to email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const userUpdateValidator = [
  body('id').isInt().withMessage('Id must be integer'),
  body('firstName')
    .optional()
    .isString()
    .isLength({ min: 2, max: 12 })
    .withMessage('Firstname should contain only letters from 2 to 12'),
  body('lastName')
    .optional()
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty'),
  body('age').optional().isInt().withMessage('Age must be integer'),
  body('status')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty')
    .optional(),
  // body('photo').optional().isURL().withMessage('Photo must be URL'),
];

export const createChildValidator = [
  body('firstName')
    .isString()
    .isLength({ min: 2, max: 12 })
    .withMessage('Firstname should contain only letters from 2 to 12'),
  body('lastName')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty'),
  body('age').optional().isInt().withMessage('Age must be integer'),
  // body('photo').isURL().withMessage('Photo must be url').optional(),
  body('sexId').isInt().withMessage('sexId must be integer(1 - man, 2 - woman)'),
];

export const createSubscriberValidator = [
  body('email').isEmail().withMessage('It is not similar to email'),
];
