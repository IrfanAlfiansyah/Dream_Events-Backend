const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dizpe4s9c",
  api_key: "288673773537429",
  api_secret: "3Ouu3O11bcD_Zdw3dW4hxC8QijA",
  secure: true,
});

module.exports = cloudinary;
