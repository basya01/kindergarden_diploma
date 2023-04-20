import dotenv from 'dotenv';
import express, { json } from 'express';
import multer, { diskStorage } from 'multer';
import path from 'path';
import {
  childRouter,
  userRouter,
  bookRouter,
  authRouter,
  subscriberRouter,
} from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(json());
app.use('/user', userRouter);
app.use('/child', childRouter);
app.use('/book', bookRouter);
app.use('/auth', authRouter);
app.use('/subscriber', subscriberRouter);
app.use('/uploads', express.static('uploads'));

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
app.post('/upload', upload.single(), (req, res) => {
  res.json({ url: `uploads/${req.file.originalname}` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
