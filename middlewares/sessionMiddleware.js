const sessionHandler = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("login", { registration: "Not Logged In" });
  }
};

module.exports = { sessionHandler };
