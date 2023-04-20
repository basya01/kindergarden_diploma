import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Book = sequelize.define(
    'Book',
    {
      author: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      release: {
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return Book;
};
