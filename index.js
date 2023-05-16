import dotenv from 'dotenv';
import express, { json } from 'express';
import cookies from 'cookie-parser';
import multer, { diskStorage } from 'multer';
import path from 'path';
import cors from 'cors';
import { errorHandler } from './middlewares/index.js';

import {
  bookRouter,
  childRouter,
  subscriberRouter,
  userRouter,
} from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(json());
app.use(cookies());
app.use(cors());
app.use('/user', userRouter);
app.use('/child', childRouter);
app.use('/book', bookRouter);
app.use('/subscriber', subscriberRouter);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

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
  res.json({ url: `uploads/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
