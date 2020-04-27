const multer = require("multer");
const datauri = require("datauri");
const path = require("path");

const multerUploads = multer({
  dest: `${__dirname}/../public/assets/uploads/`,
});

const dUri = new datauri();
const dataUri = (req) => {
  dUri.format(path.extname(req.file.originalName).toString(), req.file.buffer);
};

module.exports = { multerUploads, dataUri };

// https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54
