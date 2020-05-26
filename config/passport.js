const FacebookStrategy = require("passport-facebook").Strategy
const configAuth = require('./auth');

module.exports = function(passport) { 
    passport.serializeUser(function(user, done) {
        done(null, user)
    });

    passport.deserializeUser(function(user, done) {
        done(null, user)
    });

    passport.use(
        new FacebookStrategy(
          {
            clientID: process.env.fbclientID,
            clientSecret: process.env.fbclientSecret,
            callbackURL: process.env.fbcallbackURL,
            profileFields: ['id', 'displayName', 'link', 'photos', 'email']
          },
          function(accessToken, refreshToken, profile, cb) {
              profile.accessToken = accessToken;
            return cb(null, profile)
          }
        )
    );

}