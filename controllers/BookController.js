import { BookModel, ChildModel } from '../db/index.js';

class BookController {
  async getAll(req, res, next) {
    try {
      const books = await BookModel.findAll();
      return res.status(200).json(books);
    } catch (e) {
      return next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const book = await BookModel.findByPk(req.params.id, {
        include: ChildModel,
      });
      if (!book) {
        return res.status(404).json({ message: 'Book does not exist' });
      }
      return res.json(book);
    } catch (e) {
      return next(e);
    }
  }
}

export default new BookController();
