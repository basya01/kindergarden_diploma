import bcrypt from 'bcrypt';
import twilio from 'twilio';
import { UserModel } from '../db/index.js';
import { mailer } from '../nodemailer.js';
import TokenService from '../services/TokenService.js';
import UserService from '../services/UserService.js';
import { generateEmailVerificationCode } from '../utils/index.js';
import ApiError from '../exceptions/apiErrors.js';

class UserController {
  async register(req, res, next) {
    const { password, ...allExceptPass } = req.body;
    try {
      const isUserExist = Boolean(
        await UserService.findByEmail(allExceptPass.email)
      );
      if (isUserExist) {
        return next(ApiError.BadRequest('Such a user is already exist'));
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = await UserService.createUser({
        ...allExceptPass,
        passwordHash,
      });
      const tokens = TokenService.generateTokens({ id: user.id });
      await TokenService.saveToken(user.id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(201)
        .json({ ...user.dataValues, token: tokens.accessToken });
    } catch (e) {
      return next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return next(ApiError.NotFound('Such a user does not exist'));
      }
      console.log(user.dataValues);
      const isPassMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isPassMatch) {
        return next(
          ApiError.Forbidden('Email, phone or password is incorrect')
        );
      }
      const tokens = TokenService.generateTokens({ id: user.id });
      await TokenService.saveToken(user.id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ ...user.dataValues, token: tokens.accessToken });
    } catch (e) {
      return next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return next(ApiError.UnauthorizedError());
      }
      const token = await TokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');
      return res.json({ token, message: 'Logout is successful' });
    } catch (e) {
      return next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ ...userData, message: 'Refresh is successful' });
    } catch (e) {
      return next(e);
    }
  }

  async update(req, res, next) {
    try {
      const user = await UserModel.findByPk(req.userId);
      if (!user) {
        return next(ApiError.NotFound('Such a user does not exist'));
      }
      user.set(req.body);
      await user.save();
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    const id = req.params.id;
    try {
      const user = await UserService.getUserByPk(id);
      if (!user) {
        return next(ApiError.NotFound('User does not exist'));
      }
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await UserService.getUserByPk(req.userId);
      if (!user) {
        return next(ApiError.NotFound('User does not exist'));
      }
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  }

  async sendCodeToEmail(req, res, next) {
    const verificationCode = generateEmailVerificationCode();
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (user.isVerifedEmail) {
      return next(ApiError.BadRequest('Email is already verified'));
    }
    user.set({ emailVerificationCode: verificationCode });
    await user.save();
    const message = {
      to: user.email,
      subjetc: 'Підтвердження електронної пошти на єДніпро',
      text: `${user.firstName}, Ваш код підтверження: ${verificationCode}`,
    };
    mailer(message);

    return res.sendStatus(200);
  }

  async verifyEmail(req, res, next) {
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (user.isVerifedEmail) {
      return next(ApiError.BadRequest('Email is already verified'));
    }
    if (!user) {
      return next(ApiError.NotFound('User does not exist'));
    }
    if (user.emailVerificationCode !== +req.params.code) {
      return next(ApiError.BadRequest('Code is incorrect'));
    }
    user.set({ isVerifedEmail: true });
    await user.save();
    return res.json(user);
  }

  async sendCodeToPhone(req, res, next) {
    const accountSid = 'ACe55a785866e399f0acad40f28fcafd57';
    const authToken = '69a6aef83dd9a6a3d09e800b9b291c52';
    const client = new twilio(accountSid, authToken);

    const verificationCode = generateEmailVerificationCode();
    const message = `Код подтверждения: ${verificationCode}`;
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (user.isVerifedPhone) {
      return next(ApiError.BadRequest('Phone is already verified'));
    }
    user.set({ phoneVerificationCode: verificationCode });
    await user.save();
    client.messages
      .create({
        body: message,
        from: '+16202691186',
        to: `${user.phoneNumber}`,
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.status(500).json({ message: 'Error, sms is not sent' });
      });
  }

  async verifyPhone(req, res, next) {
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (user.isVerifedPhone) {
      return next(ApiError.BadRequest('Phone is already verified'));
    }
    if (user.phoneVerificationCode !== +req.params.code) {
      return next(ApiError.BadRequest('Code is incorect'));
    }
    user.set({ isVerifedPhone: true });
    await user.save();
    return res.json(user);
  }
}

export default new UserController();
