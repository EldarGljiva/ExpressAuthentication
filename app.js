import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

//middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to db
mongoose.connect("mongodb://localhost:27017/userDB");
//create schema for db
const userSchema = new mongoose.Schema({
  username: String,
  password: Number,
});
//create model
const User = mongoose.model("users", userSchema);

app.get("/", async (req, res) => {
  try {
    res.render("home.ejs");
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
app.get("/login", async (req, res) => {
  try {
    res.render("login.ejs");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Application listening on port: ${port}`);
});
