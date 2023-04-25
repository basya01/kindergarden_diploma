import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Token = sequelize.define(
    'Token',
    {
      refreshToken: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Token;
};
