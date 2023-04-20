import { body } from 'express-validator';

const firstName = body('firstName')
  .isString()
  .isLength({ min: 2, max: 12 })
  .isAlpha()
  .withMessage('Firstname should contain only letters from 2 to 12');
const lastName = body('lastName')
  .isString()
  .isLength({ min: 2, max: 20 })
  .withMessage('Lastname should contain only letters from 2 to twenty');
const age = body('age').isInt().withMessage('Age must be integer');
const photo = body('photo').isURL().withMessage('Photo must be URL');

export const registerValidator = [
  body('email').isEmail().withMessage('It is not similar to email'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('It is not similar to phone number'),
  firstName,
  lastName,
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
  photo.optional(),
];

export const loginValidator = [
  body('email').optional().isEmail().withMessage('It is not similar to email'),
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('It is not similar to phone number'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const userUpdateValidator = [
  firstName.optional(),
  lastName.optional(),
  age.optional(),
  body('status')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Lastname should contain only letters from 2 to twenty')
    .optional(),
  photo.optional(),
];

export const createChildValidator = [
  firstName,
  lastName,
  age.optional(),
  body('photo').isURL().withMessage('Photo must be url').optional(),
  photo.optional(),
];
