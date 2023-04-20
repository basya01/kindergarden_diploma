import { BookModel, ChildModel } from '../db/index.js';

class BookController {
  async getAll(req, res) {
    try {
      const books = await BookModel.findAll();
      return res.status(200).json(books);
    } catch (e) {
      return res.status(500).json({ message: 'Books are not received' });
    }
  }

  async getOne(req, res) {
    try {
      const book = await BookModel.findByPk(req.params.id, {
        include: ChildModel,
      });
      if (!book) {
        return res.status(404).json({ message: 'Book does not exist' });
      }
      return res.json(book);
    } catch (e) {
      return res.status(500).json({ message: 'Book is not recieved' });
    }
  }
}

export default new BookController();