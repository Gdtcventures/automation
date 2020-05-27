const bigcommerce = require('../helpers/bigcommerce');
module.exports = function(app, passport) { 

    app.get("/", (req, res) => {
        res.render("layouts/home", {
          user: req.user,
        })
    });

    app.get("/auth/facebook", passport.authenticate("facebook", { scope: ['public_profile'] }),(req, res) => {
      console.log("Logging in via Facebook");
    });

    app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", { 
          failureRedirect: "/"
        }),
        async function(req, res) {
          const token = await bigcommerce.getLoginUrl(req.user[0].id);
          res.json({
            user_id: req.user[0].id,
            token
          });
          //res.redirect(redirect_url);
        }
      );

      app.get('/login', (req, res) =>{
        res.redirect('/auth/facebook');
      });

      app.get('/logout', (req, res) => {
        req.session.destroy();
      });
}