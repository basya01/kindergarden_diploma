import ApiError from '../exceptions/apiErrors.js';
import { UserService } from '../services/index.js';

export const checkChildBelongsUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const childId = req.body.childId;
    const user = await UserService.getUserByPk(userId);
    const isChildBelongsUser = user.Children.some(
      (child) => child.id === childId
    );
    if (!isChildBelongsUser) {
      return next(ApiError.Forbidden('No access'));
    }
    return next();
  } catch (e) {
    return next(e);
  }
};
