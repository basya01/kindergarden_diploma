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
      phoneNumber: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
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
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['passwordHash'],
        },
      },
    }
  );

  return User;
};
