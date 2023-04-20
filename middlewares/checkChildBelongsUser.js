import { UserService } from '../services/index.js';

export const checkChildBelongsUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const childId = req.body.childId;
    const user = await UserService.getUserByPk(userId);
    const isChildBelongsUser = user.Children.some((child) => child.id === childId);
    if (!isChildBelongsUser) {
      return res.status(403).json({ message: 'No access' });
    }
    next();
  } catch (e) {
    res.status(500).json({ message: 'User verification failed' });
  }
};
