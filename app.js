var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

require("dotenv").config();

const port = process.env.PORT || 3001;

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var postsRouter = require("./routes/posts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const pgPool = require("./db/pool");
const passport = require("passport");

const sessionStore = new pgSession({
  pool: pgPool,
  tableName: "user_sessions",
});

app.use(
  session({
    store: sessionStore,
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/clubhouse", authRouter);
app.use("/clubhouse/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
