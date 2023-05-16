import { Op } from 'sequelize';
import { BookModel, ChildModel, ChildBookModel } from '../db/index.js';

class ChildController {
  async create(req, res, next) {
    try {
      const child = await ChildModel.create({
        ...req.body,
        parentId: req.userId,
      });
      return res.status(201).json(child);
    } catch (e) {
      return next(e);
    }
  }

  async addBook(req, res, next) {
    try {
      const { childId, bookId } = req.body;
      const child = await ChildModel.findByPk(childId, { include: BookModel });
      const isChildHasBook = child.Books.some((book) => book.id === bookId);
      if (isChildHasBook) {
        return res.status(400).json({ message: 'Child already has this book' });
      }
      const book = await BookModel.findByPk(bookId);
      await child.addBook(book);
      return res.status(201).json(book);
    } catch (e) {
      return next(e);
    }
  }

  async updateChildBook(req, res, next) {
    try {
      const { childId, bookId, progress } = req.body;
      const book = await ChildBookModel.findOne({
        where: { [Op.and]: [{ BookId: bookId }, { ChildId: childId }] },
      });
      if (!book) {
        return res.status(404).json({ message: 'Book does not exists' });
      }
      book.set({ progress });
      await book.save();
      return res.json(book);
    } catch (e) {
      return next(e);
    }
  }
}

export default new ChildController();
