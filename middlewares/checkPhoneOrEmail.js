export const checkPhoneOrEmail = (req, res, next) => {
  if (!req.body.email && !req.body.phoneNumber) {
    return res
      .status(400)
      .json({ message: 'Email or phone number is required' });
  }
  next();
};
