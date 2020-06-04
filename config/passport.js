const FacebookStrategy = require("passport-facebook").Strategy;
const bigcommerce = require('../helpers/bigcommerce');
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
            profileFields: ["id","first_name","last_name","email","picture"]
          },
          async function(accessToken, refreshToken, profile, cb) {
              profile._json.accessToken = accessToken;
              const response = await bigcommerce.createCustomer(profile._json);
              response.data.accessToken = accessToken;
              return cb(null, response.data);
          }
        )
    );

}