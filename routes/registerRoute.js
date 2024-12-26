const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const upload = require("../utils/multerUtil");

const registerRouter = express.Router();

registerRouter.get("/register", (req, res) => {
  res.render("register", { message: "" });
});

registerRouter.post("/login", upload.single("file"), async (req, res) => {
  try {
    const { name, age, email, password, role, file } = req.body;

    const checkExistingUser = await User.findOne({
      $or: [{ email }],
    });

    if (checkExistingUser) {
      return res.render("register", { message: "email already exits" });
    }

    //hash user password:

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in  the db:

    const newUser = new User({
      name,
      age,
      email,
      password: hashedPassword,
      role: role || "user",
      image: req.file.filename,
    });

    await newUser.save();

    if (newUser) {
      res.render("login", { registration: "registration successful" });
    } else {
      res.render("register", { message: "unable to register, try again" });
    }
  } catch (error) {
    res.render("register", { message: "unexpected error, try again!" });
  }
});

module.exports = { registerRouter };
