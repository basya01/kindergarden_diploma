import { Sequelize } from 'sequelize';
import { User, Child, Book, ChildBook, Subscriber } from './models/index.js';
import config from '../config/config.js';

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

(async () => {
  await sequelize.sync();
})();

export const UserModel = User(sequelize);
export const ChildModel = Child(sequelize);
export const BookModel = Book(sequelize);
export const ChildBookModel = ChildBook(sequelize);
export const SubscriberModel = Subscriber(sequelize);

UserModel.hasMany(ChildModel, { foreignKey: 'parentId' });
ChildModel.belongsToMany(BookModel, { through: ChildBookModel });
BookModel.belongsToMany(ChildModel, {
  through: ChildBookModel,
});
