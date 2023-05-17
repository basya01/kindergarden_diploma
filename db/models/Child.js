import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('Child', {
    firstName: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      // validate: {
      //   isUrl: true,
      // },
    },
  });

  return User;
};
