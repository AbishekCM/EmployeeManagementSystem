const express = require("express");
const {
  uploadImage,
  getImages,
  deleteImage,
} = require("../controller/imageController");
const multerUtil1 = require("../utils/multerUtil1");
const { sessionHandler } = require("../middlewares/sessionMiddleware");

const imageRouter = express.Router();

imageRouter.post(
  "/images",
  sessionHandler,
  multerUtil1.single("file"),
  uploadImage
);
imageRouter.get("/images", sessionHandler, getImages);

imageRouter.get("/images/delete/:id", sessionHandler, deleteImage);

module.exports = imageRouter;
