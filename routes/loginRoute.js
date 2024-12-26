const express = require("express");

const loginRoter = express.Router();

loginRoter.get("/login", (req, res) => {
  res.render("login", { registration: "" });
});

module.exports = { loginRoter };
