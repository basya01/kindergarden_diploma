import { SubscriberModel } from '../db/index.js';

class SubscriberController {
  async create(req, res) {
    try {
      const subscriber = await SubscriberModel.create({
        email: req.body.email,
      });
      return res.json(subscriber);
    } catch (e) {
      if (e.original.errno === 1062) {
        return res.status(400).json({ message: 'Subscriber already exists' });
      }
      return res.status(500).json({ message: 'Subscriber is not created' });
    }
  }
}
export default new SubscriberController();
