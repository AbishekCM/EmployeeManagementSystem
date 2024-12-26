const multer = require("multer");
const path = require("path");

//set multer storage:

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images1");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//file filter function:
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
  cb(new Error("not an image!"));
};

//multer Middleware:

module.exports = multer({
  storage: storage,
  filefilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB max
  },
});
