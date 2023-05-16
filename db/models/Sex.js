import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Sex = sequelize.define(
    'Sex',
    {
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Sex;
};
