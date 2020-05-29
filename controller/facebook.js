const bigcommerce = require('../helpers/bigcommerce');
const { redirectUrl } = require('../config/config');
const Mixpanel = require('../helpers/mixpanel');


module.exports = function(app, passport) { 
    var path = null
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
          let redirect_url = "";
          if(path !== null){
            if(path === redirectUrl.honebase.key){
              const mixpanel_honebase = new Mixpanel(redirectUrl.honebase.token,req.user[0].id);
              mixpanel_honebase.trackFBSignUp(req.user[0].first_name, req.user[0].last_name);
              redirect_url = `${redirectUrl.honebase.url}?id=${req.user[0].id}&token=${token}`;
              res.redirect(redirect_url);
            }else if(path === redirectUrl.fliphim.key){
              const mixpanel_fliphim = new Mixpanel(redirectUrl.fliphim.token, req.user[0].id);
              mixpanel_fliphim.trackFBSignUp(req.user[0].first_name, req.user[0].last_name);
              redirect_url = `${redirectUrl.fliphim.url}?id=${req.user[0].id}&token=${token}`;
              res.redirect(redirect_url);
            }else{
              res.send('Invalid Request');
            }
          }else{
            res.send('Invalid Request');
          }
        }
      );

      app.get('/login', (req, res) =>{
        path = req.query.serviceURL;
        res.redirect('/auth/facebook');
      });

      app.get('/logout', (req, res) => {
        req.session.destroy();
      });
}