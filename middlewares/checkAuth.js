import { UserModel } from '../db/index.js';
import ApiError from '../exceptions/apiErrors.js';
import TokenService from '../services/TokenService.js';

export async function checkAuth(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = await TokenService.validateAceessToken(accessToken);
    const user = await UserModel.findOne({ where: { id: userData.id } });
    if (!user) {
      return next(ApiError.UnauthorizedError());
    }
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.userId = userData.id;
    return next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
