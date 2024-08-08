const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries");
const bcrypt = require("bcrypt");

const verifyCallback = async (username, password, done) => {
  try {
    const user = await db.getUserByUsername(username);
    if (!user) {
      done(null, false, { message: "Incorrect username or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.getUserById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
