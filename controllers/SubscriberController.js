import { SubscriberModel } from '../db/index.js';
import ApiError from '../exceptions/apiErrors.js';

class SubscriberController {
  async create(req, res, next) {
    try {
      const subscriber = await SubscriberModel.create({
        email: req.body.email,
      });
      return res.json(subscriber);
    } catch (e) {
      if (e.original.errno === 1062) {
        next(ApiError.BadRequest('Subscriber already exists'));
      }
      return next(e);
    }
  }
}
export default new SubscriberController();
