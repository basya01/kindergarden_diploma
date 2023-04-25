import jwt from 'jsonwebtoken';
import { TokenModel } from '../db/index.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ where: { userId } });

    if (tokenData) {
      tokenData.set({ refreshToken });
      return await tokenData.save();
    }
    const token = await TokenModel.create({ userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const token = await TokenModel.destroy({ where: { refreshToken } });
    return token;
  }

  async validateAceessToken(token) {
    const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    return userData;
  }

  async validateRefreshToken(token) {
    const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    return userData;
  }

  async findToken(token) {
    const refreshToken = await TokenModel.findOne({
      where: { refreshToken: token },
    });
    return refreshToken;
  }
}

export default new TokenService();
