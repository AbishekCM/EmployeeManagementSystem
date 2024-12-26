const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const session = require("express-session");
const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const getImages = async (req, res) => {
  const images = await Image.find({});

  res.render("images", { images: images });
};

const deleteImage = async (req, res) => {
  const imageId = req.params.id;

  const sessionUserId = req.session.user.id;

  const image = await Image.findById(imageId);

  //check if image exists
  if (!image) {
    res.status(404).json({
      success: false,
      message: "file not found",
    });
  }

  //check if the image is uploaded by same user as logged in ...

  if (sessionUserId !== image.uploadedBy.toString()) {
    return res.status(403).json({
      success: false,
      message: "not authorize to delete this image",
    });
  }

  //delete the image first from cloudinary

  await cloudinary.uploader.destroy(image.publicId);

  //delete from mongodb:

  await Image.findByIdAndDelete(imageId);
  const images = await Image.find({});
  res.render("images", { images: images });
};
const uploadImage = async (req, res) => {
  try {
    //if file is missing in the req object

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file is required, please upload an image",
      });
    }

    //upload to cloudinary:

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with the uploaded user id:

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.session.user.id,
    });

    await newlyUploadedImage.save();

    const images = await Image.find({});
    res.render("images", { images: images });
    /* res.status('201').json({
      success:true,
      message:'Image uploaded successfully',
      image:newlyUploadedImage,
    }); */

    //after uploading to the cloud, we can delete from the local folder, the images
    //fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: "something went wrong, try again",
    });
  }
};

module.exports = { uploadImage, getImages, deleteImage };
