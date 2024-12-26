const express = require("express");
const { sessionHandler } = require("../middlewares/sessionMiddleware");
const authorizeRoles = require("../middlewares/roleBasedAuth");

adminRouter = express.Router();

adminRouter.get("/admin", sessionHandler, authorizeRoles, (req, res) => {
  res.send("welcome to admin panel");
});

module.exports = { adminRouter };
