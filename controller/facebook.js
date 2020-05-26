const bigcommerce = require('../helpers/bigcommerce');
module.exports = function(app, passport) { 

    app.get("/", (req, res) => {
        res.render("layouts/home", {
          user: req.user,
        })
    });

    app.get("/auth/facebook", passport.authenticate("facebook"));

    app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", { 
          failureRedirect: "/",
          scope : ['public_profile', 'email']
        }),
        async function(req, res) {
          const response = await bigcommerce.createCustomer(res.req.user._json);
          const redirect_url = await bigcommerce.getLoginUrl(response.data[0].id)
          res.redirect(redirect_url);
        }
      );
}