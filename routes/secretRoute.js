const express = require("express");
const { sessionHandler } = require("../middlewares/sessionMiddleware");
const authorizeRoles = require("../middlewares/roleBasedAuth");

const secretRouter = express.Router();

secretRouter.get("/secret", sessionHandler, authorizeRoles, (req, res) => {
  res.render("secret", { email: req.session.user.id });
});

module.exports = { secretRouter };
