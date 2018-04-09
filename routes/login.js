const express = require('express')
const passport = require('passport')
const util = require('util')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const path = require('path')
require('dotenv').config()

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Strava profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  console.log('serializeUser - user', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserializeUser - obj', obj);
  done(null, obj);
});

// Use the StravaStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Strava
//   profile), and invoke a callback with a user object.
passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/strava/callback",
    approvalPrompt: 'force'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log('accessToken', accessToken);
    process.nextTick(function () {

      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log(res.headers)
  res.json({ title: 'I am here'})
})

// GET /login/strava
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
router.get('/strava', passport.authenticate('strava', { scope: ['public'] }),
  (req, res) => {
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  })

// GET /login/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/strava/callback', passport.authenticate('strava', { failureRedirect: '/' }),
  (req, res) => {
    console.log('am I here?');
    res.redirect('/')
  })

module.exports = router
