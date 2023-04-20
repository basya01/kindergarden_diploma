import { Op } from 'sequelize';
import { ChildModel, UserModel } from '../db/index.js';

class UserService {
  async findByEmailOrPhone(email, phoneNumber) {
    const inputValue = email || phoneNumber;
    const user = await UserModel.findOne({
      where: { [Op.or]: [{ email: inputValue }, { phoneNumber: inputValue }] },
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
}

export default new UserService();
