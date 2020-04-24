const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const app = express();

/* MIDDLEWARE */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: require("./models").mongooseConnection,
    }),
  })
);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

/* ROUTES */
const routes = require("./routes");
app.use("/auth", routes.authRoutes);
app.use("/spaces", routes.spacesRoutes);

app.get("/", (req, res) => {
  res.send("Success");
});

const port = process.env.PORT || 3550;
app.listen(port, () => `Server listening @ Port ${port}`);
