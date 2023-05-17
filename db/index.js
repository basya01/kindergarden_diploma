import { Sequelize } from "sequelize";
import {
  User,
  Child,
  Book,
  ChildBook,
  Subscriber,
  Token,
  Sex,
} from "./models/index.js";
import config from "../config/config.js";

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    port: config.development.port,
  }
);

(async () => {
  await sequelize.sync({alter: true});
})();

export const UserModel = User(sequelize);
export const ChildModel = Child(sequelize);
export const BookModel = Book(sequelize);
export const ChildBookModel = ChildBook(sequelize);
export const SubscriberModel = Subscriber(sequelize);
export const TokenModel = Token(sequelize);
export const SexModel = Sex(sequelize);

UserModel.hasOne(TokenModel, { foreignKey: "userId" });
UserModel.hasMany(ChildModel, { foreignKey: "parentId" });
SexModel.hasMany(ChildModel, {
  foreignKey: { name: "sexId", allowNull: false },
});
ChildModel.belongsToMany(BookModel, { through: ChildBookModel });
BookModel.belongsToMany(ChildModel, {
  through: ChildBookModel,
});
