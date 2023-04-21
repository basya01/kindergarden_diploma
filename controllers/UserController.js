import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../db/index.js';
import UserService from '../services/UserService.js';
import { mailer } from '../nodemailer.js';
import { generateEmailVerificationCode } from '../utils/index.js';
import twilio from 'twilio';

class UserController {
  async register(req, res) {
    const { password, ...allExceptPass } = req.body;
    try {
      const isUserExist = Boolean(
        await UserService.findByEmailOrPhone(
          allExceptPass.email,
          allExceptPass.phoneNumber
        )
      );
      if (isUserExist) {
        return res.status(400).json({ message: 'Such a user already exists' });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = await UserService.createUser({
        ...allExceptPass,
        passwordHash,
      });

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: '10d',
      });

      // const message = {
      //   to: user.email,
      //   subjetc: 'Реєстрація на єДніпро',
      //   text: `${user.firstName}, дякую за реєстрацію! Ваш код підтверження ${emailVerificationCode}`,
      // };
      // mailer(message);

      return res.status(201).json({ ...user.dataValues, token });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'User is not created' });
    }
  }

  async login(req, res) {
    try {
      const { email, password, phoneNumber } = req.body;
      const user = await UserService.findByEmailOrPhoneUnscoped(
        email,
        phoneNumber
      );
      if (!user) {
        return res.status(404).json({ message: 'Such a user does not exist' });
      }
      const isPassMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isPassMatch) {
        return res
          .status(403)
          .json({ message: 'Email, phone or password is incorrect' });
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: '10d',
      });
      return res.json({ ...user.dataValues, token });
    } catch (e) {
      return res.status(500).json({ message: 'Login is not succeeded' });
    }
  }

  async update(req, res) {
    try {
      const user = await UserModel.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Such a user does not exist' });
      }
      user.set(req.body);
      await user.save();
      return res.json(user);
    } catch (e) {
      return res.status(500).json({ message: 'Login is not succeeded' });
    }
  }

  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (e) {
      return res.status(500).json({ message: 'Users is not received' });
    }
  }

  async getOne(req, res) {
    const id = req.params.id;
    try {
      const user = await UserService.getUserByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      return res.json(user);
    } catch (e) {
      return res.status(500).json({ message: 'Users is not received' });
    }
  }

  async getMe(req, res) {
    try {
      const user = await UserService.getUserByPk(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'User is not recieved' });
    }
  }

  async sendCodeToEmail(req, res) {
    const verificationCode = generateEmailVerificationCode();
    const user = await UserModel.unscoped().findByPk(req.userId);
    user.set({ emailVerificationCode: verificationCode });
    await user.save();
    const message = {
      to: user.email,
      subjetc: 'Підтвердження електронної пошти на єДніпро',
      text: `${user.firstName}, Ваш код підтверження: ${verificationCode}`,
    };
    mailer(message);

    res.sendStatus(200);
  }

  async verifyEmail(req, res) {
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    if (user.emailVerificationCode !== +req.params.code) {
      return res.status(400).json({ message: 'Code is incorect' });
    }
    user.set({ isVerifedEmail: true });
    await user.save();
    return res.json(user);
  }

  async sendCodeToPhone(req, res) {
    const accountSid = 'ACe55a785866e399f0acad40f28fcafd57';
    const authToken = '69a6aef83dd9a6a3d09e800b9b291c52';
    const client = new twilio(accountSid, authToken);

    const verificationCode = generateEmailVerificationCode();
    const message = `Код подтверждения: ${verificationCode}`;
    const user = await UserModel.unscoped().findByPk(req.userId);
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
      .catch((e) => {
        console.log(e);
        res.status(500).json({ message: 'Error, sms is not sent' });
      });
  }

  async verifyPhone(req, res) {
    const user = await UserModel.unscoped().findByPk(req.userId);
    if (user.phoneVerificationCode !== +req.params.code) {
      return res.status(400).json({ message: 'Code is incorect' });
    }
    user.set({ isVerifedPhone: true });
    await user.save();
    return res.json(user);
  }
}

export default new UserController();
