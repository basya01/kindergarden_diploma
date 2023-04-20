import { Router } from 'express';
import { BookController } from '../controllers/index.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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
      console.log(accessToken);
      console.log(refreshToken);
      return done(null, profile);
    }
  )
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const router = new Router();

router.get('/profile', ensureAuthenticated, function (req, res) {
  res.render('profile', { user: req.user });
});
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.get('/', BookController.getAll);
router.get('/:id', BookController.getOne);

export default router;
