import { Op } from 'sequelize';
import { ChildModel, UserModel } from '../db/index.js';
import TokenService from './TokenService.js';
import ApiError from '../exceptions/apiErrors.js';

class UserService {
  async findByEmailOrPhone(email, phoneNumber) {
    const inputValue = email || phoneNumber;
    const user = await UserModel.findOne({
      where: { [Op.or]: [{ email: inputValue }, { phoneNumber: inputValue }] },
    });
    return user;
  }
  async findByEmail(email) {
    const user = await UserModel.unscoped().findOne({
      where: { email },
    });
    return user;
  }

  async findByEmailOrPhoneUnscoped(email, phoneNumber) {
    const inputValue = email || phoneNumber;
    const user = await UserModel.unscoped().findOne({
      where: { [Op.or]: [{ email: inputValue }, { phoneNumber: inputValue }] },
    });
    return user;
  }

  async createUser(userParams) {
    const user = await UserModel.create(userParams);
    return user;
  }

  async getAllUsers() {
    const users = await UserModel.findAll({
      include: ChildModel,
    });
    return users;
  }

  async getUserByPk(pk) {
    const user = await UserModel.findByPk(pk, { include: 'Children' });
    return user;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      console.log(ApiError.UnauthorizedError());
      throw ApiError.UnauthorizedError();
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnathorizedError();
    }
    const tokens = TokenService.generateTokens({ id: userData.id });
    await TokenService.saveToken(userData.id, tokens.refreshToken);
    return { id: userData.id, ...tokens };
  }
}

export default new UserService();
