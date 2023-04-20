import jwt from 'jsonwebtoken';
import { UserModel } from '../db/index.js';

export const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'No access' });
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Token is not valid' });
      }
      const user = await UserModel.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'Such a user does not exist' });
      }
      req.userId = user.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Authorization is not confirmed' });
  }
};
