const express = require("express");
const { sessionHandler } = require("../middlewares/sessionMiddleware");
const authorizeRoles = require("../middlewares/roleBasedAuth");
const upload = require("../utils/multerUtil");

const User = require("../models/user");

const usersRouter = express.Router();
const bcrypt = require("bcryptjs");

usersRouter.get("/users", authorizeRoles, async (req, res) => {
  const users = await User.find({});

  res.render("users", { users: users });
});

usersRouter.post("/users/table/search", async (req, res) => {
  const { name } = req.body;

  const searchQuery = new RegExp(name, "i");

  const usersQueried = await User.find({
    $or: [
      { name: { $regex: searchQuery } },
      { email: { $regex: searchQuery } },
    ],
  });

  res.render("usersTable", { users: usersQueried, view: "search" });
});

usersRouter.get("/users/table", authorizeRoles, async (req, res) => {
  const users = await User.find({});

  if (Object.keys(req.query).length !== 0) {
    const { page = 1, limit = 3 } = req.query;

    //conversion:
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    //getting users according to query
    const queriedUsers = await User.find()
      .sort({ age: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    //total Users
    const totalUsers = await User.countDocuments();

    //total pages:
    const totalPages = Math.ceil(totalUsers / limitNum);

    res.render("usersTable", {
      users: queriedUsers,
      currentPage: pageNum,
      totalPages,
      limitNum,
      view: "limited",
    });
  } else {
    res.render("usersTable", { users: users, view: "all" });
    /* console.log(users);
  res.render("usersTable", { users: users,
    currentPage:0,
      totalPages:0,
      limitNum:0
   }); */
  }
});

usersRouter.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findOne({ _id });

  res.render("userDetails", { user: user, sessionUser: req.session.user.role });
});

usersRouter.get("/users/edit/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findOne({ _id });

  res.render("userEdit", { user: user, sessionUser: req.session.user.role });
});

usersRouter.post("/users/:id", upload.single("file"), async (req, res) => {
  const _id = req.params.id;

  const user = await User.findOne({ _id });
  const fileName = req.file ? req.file.filename : user.image;

  const filter = { _id: _id };
  const update = {
    $set: {
      name: req.body.name || user.name,
      age: req.body.age || user.age,
      email: req.body.email || user.email,
      image: fileName,
      role: req.body.role || user.role,
    },
  };

  await User.updateOne(filter, update);

  const updatedUser = await User.findOne({ _id });

  res.render("userDetails", {
    user: updatedUser,
    sessionUser: req.session.user.role,
  });
});

usersRouter.get("/users/changePassword/:id", (req, res) => {
  const _id = req.params.id;

  const filter = { _id: _id };
  res.render("changePassword", { message: "", user: filter });
});

usersRouter.post("/users/changePassword/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findOne({ _id });
  const { oldpassword, newpassword } = req.body;

  //verify current password:
  const isMatch = await bcrypt.compare(oldpassword, user.password);

  if (!isMatch) {
    return res.render("changePassword", {
      message: "current password is incorrect!!",
      user: user,
    });
  }

  if (oldpassword === newpassword) {
    return res.render("changePassword", {
      message: "new and old password cannot be same",
      user: user,
    });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);

  //update password in db
  user.password = hashedPassword;
  await user.save();
  res.render("login", { registration: "password changed successfully" });
});

module.exports = { usersRouter };
