const express = require("express");
const { sessionHandler } = require("../middlewares/sessionMiddleware");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", sessionHandler, async (req, res) => {
  const email = req.session.user.email;
  const user = await User.findOne({ email });
  res.render("dashboard", { user: user });
});

dashboardRouter.post("/dashboard", async (req, res) => {
  try {
    const { email, password } = req.body;

    //find if the current user is exits or not:

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        registration: "user or password not found",
      });
    }

    //check if password is correct or not

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.render("login", {
        registration: "user or password not found",
      });
    }

    req.session.user = { id: user._id, email: user.email, role: user.role };

    res.render("dashboard", { user: user });
  } catch (error) {
    res.render("login", { registration: "login unsuccessful, try again!" });
  }
});

module.exports = { dashboardRouter };
