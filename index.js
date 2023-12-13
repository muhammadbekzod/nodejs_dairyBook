const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const pgStore = require("connect-pg-simple")(session);
const csrf = require("csurf");
const db = require("./models/index");
const pool = require("./config/db");
const flash = require("connect-flash");
//Initial env variable

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    store: new pgStore({
      pool: pool,
      tableName: "user_session",
    }),
    secret: "my secret value",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

//Intialize tamplate engine (hbs)
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));
//Intialize Routes

app.use("/diary", require("./routes/diary.route"));
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));
app.use("/", async (req, res) => {
  try {
    if (req.session.isLogged) {
      res.redirect("/diary/my");
    }
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const connect = await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
