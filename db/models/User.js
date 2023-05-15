import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(319),
        allowNull: false,
        validate: { isEmail: true },
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(72),
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
      },
      age: {
        type: DataTypes.INTEGER(),
      },
      status: {
        type: DataTypes.STRING(10),
      },
      emailVerificationCode: {
        type: DataTypes.INTEGER,
      },
      phoneVerificationCode: {
        type: DataTypes.INTEGER,
      },
      isVerifedEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerifedPhone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      getters: {
        isFullVerified() {
          return this.isVerifedEmail && this.isVerifedPhone;
        },
      },
      defaultScope: {
        attributes: {
          exclude: [
            'passwordHash',
            'emailVerificationCode',
            'phoneVerificationCode',
          ],
        },
      },
    }
  );

  return User;
};
