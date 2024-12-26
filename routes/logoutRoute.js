const express = require("express");

const logoutRouter = express.Router();

logoutRouter.post("/", (req, res) => {
  const user = req.body;

  req.session.destroy();

  res.redirect("/");
});

module.exports = { logoutRouter };
