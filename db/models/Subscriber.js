import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Subscriber = sequelize.define(
    'Subscriber',
    {
      email: {
        type: DataTypes.STRING(319),
        allowNull: false,
        validate: { isEmail: true },
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Subscriber;
};
