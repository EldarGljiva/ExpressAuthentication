import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import md5 from "md5";

const app = express();
const port = 3000;

//middleware
app.use(express.static("public")); //use public folder as static files
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

const User = mongoose.model("User", userSchema);

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
  try {
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/content", function (req, res) {
  try {
    res.render("content.ejs");
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.email,
      password: md5(req.body.password),
    });

    await user.save();

    res.redirect("/content");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.email;
    const password = md5(req.body.password);
    const foundUser = await User.findOne({
      username: username,
      password: password,
    });

    if (foundUser) {
      console.log("User logged in: " + foundUser);
      res.redirect("/content");
    } else {
      res.render("login.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
