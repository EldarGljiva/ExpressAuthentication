import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import LocalStrategy from "passport-local";
//Passport is middleware for Node.js that makes it easy to implement authentication and authorization.
const app = express();
const port = 3000;

//middleware
app.use(express.static("public")); //use public folder as static files
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //manage passport to use session

mongoose
  .connect("mongodb://localhost:27017/userDB")
  .then(() => console.log("Database connected succesfully"))
  .catch((err) => {
    console.log("Database connection failed, " + err);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", async (req, res) => {
  try {
    res.render("home.ejs");
  } catch (err) {
    console.log(err);
  }
});
app.get("/login", async (req, res) => {
  try {
    res.render("login.ejs");
  } catch (err) {
    console.log(err);
  }
});
app.get("/register", async (req, res) => {
  try {
    res.render("register.ejs");
  } catch (err) {
    console.log(err);
  }
});
app.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/content", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("content");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  User.register(
    { username: req.body.email },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        console.log("User registered: " + user);
        passport.authenticate("local")(req, res, function () {
          res.redirect("/content");
        });
      }
    }
  );
});
app.post("/login", async (req, res) => {
  const user = new User({
    username: req.body.email,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      //local because local user database
      passport.authenticate("local")(req, res, function () {
        res.redirect("/content");
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
