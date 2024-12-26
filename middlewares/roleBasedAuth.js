const authorizeRoles = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.send("not authorized,admin access required");
  }

  next();
};

module.exports = authorizeRoles;