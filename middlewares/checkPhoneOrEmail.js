import ApiError from '../exceptions/apiErrors.js';

export const checkPhoneOrEmail = (req, res, next) => {
  if (!req.body.email && !req.body.phoneNumber) {
    return next(ApiError.BadRequest('Email or phone number is required'));
  }
  return next();
};
