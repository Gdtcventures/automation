const express = require("express");
const cors = require('cors');
const exphbs = require("express-handlebars");
const passport = require("passport");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./helpers/swagger.json');

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
require('./config/passport')(passport); 

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
app.use(passport.initialize())
app.use(passport.session())

require('./controller/facebook.js')(app, passport);

app.listen(process.env.PORT || 3000, () => {
console.log("Server is Running in Port 3000")
})