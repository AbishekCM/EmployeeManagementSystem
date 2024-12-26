const express = require("express");
const session = require("express-session");
const { sessionHandler } = require("../middlewares/sessionMiddleware");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.render("home");
});

module.exports = { homeRouter };
