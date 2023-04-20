import { Op } from 'sequelize';
import { BookModel, ChildModel, ChildBookModel } from '../db/index.js';

class ChildController {
  async create(req, res) {
    const child = await ChildModel.create({
      ...req.body,
      parentId: req.userId,
    });
    return res.status(201).json(child);
  }

  async addBook(req, res) {
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
      return res.status(500).json({ message: 'Book is not added' });
    }
  }

  async updateChildBook(req, res) {
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
      console.log(e.message);
      return res.status(500).json('Book is not updated');
    }
  }
}

export default new ChildController();
