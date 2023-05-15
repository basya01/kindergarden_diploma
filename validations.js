import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('It is not similar to email'),
  body('firstName')
    .isString()
    .isLength({ min: 2, max: 12 })
    .isAlpha()
    .withMessage('Firstname should contain only letters from 2 to 12'),
  body('lastName')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty'),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
    .withMessage(
      'Password should have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    ),
  body('photo').optional().isURL().withMessage('Photo must be URL'),
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
    .isAlpha()
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
  body('photo').optional().isURL().withMessage('Photo must be URL'),
];

export const createChildValidator = [
  body('firstName')
    .isString()
    .isLength({ min: 2, max: 12 })
    .isAlpha()
    .withMessage('Firstname should contain only letters from 2 to 12'),
  body('lastName')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty'),
  body('age').optional().isInt().withMessage('Age must be integer'),
  body('photo').isURL().withMessage('Photo must be url').optional(),
  body('photo').optional().isURL().withMessage('Photo must be URL'),
];

export const createSubscriberValidator = [
  body('email').isEmail().withMessage('It is not similar to email'),
];
