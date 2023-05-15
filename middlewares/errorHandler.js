import ApiError from '../exceptions/apiErrors.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  console.log(err);
  return res.status(500).json({ message: 'Unexpected error' });
};
