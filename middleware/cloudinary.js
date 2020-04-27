const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(imagePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imagePath, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
}

module.exports = { cloudinary, uploadToCloudinary };
