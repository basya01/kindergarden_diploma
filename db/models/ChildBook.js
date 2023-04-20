import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ChildBook = sequelize.define(
    'Child_Book',
    {
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          max: 100,
          min: 0,
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ChildBook;
};
