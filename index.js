import dotenv from 'dotenv';
import express, { json } from 'express';
import multer, { diskStorage } from 'multer';
import path from 'path';
import { childRouter, userRouter, bookRouter } from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '179954814552-l39uqahc43ubui822one6s4bkqlugr9o.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // process user profile and store data in database
      return done(null, profile);
    }
  )
);

app.use(json());
app.use('/user', userRouter);
app.use('/child', childRouter);
app.use('/book', bookRouter);
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/profile', ensureAuthenticated, function (req, res) {
  res.render('profile', { user: req.user });
});
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);
app.get('/auth/g', (req, res) => {
  res.json({ message: 'ok' });
});
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
