const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadEvent: (request, response, next) => {
    // JIKA INGIN MENYIMPAN FILE KE FOLDER PROJECT
    // const storage = multer.diskStorage({
    //   destination(req, file, cb) {
    //     cb(null, "public/uploads/product");
    //   },
    //   filename(req, file, cb) {
    //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    //     // console.log(file);
    //     // file = {
    //     //     fieldname: 'image',
    //     //     originalname: 'Visual Background - Fullstack Webiste-01.png',
    //     //     encoding: '7bit',
    //     //     mimetype: 'image/png'
    //     //   }
    //     // console.log(uniqueSuffix);
    //     // uniqueSuffix = 1662708893973-855005446
    //     cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    //   },
    // });
    // JIKA INGIN MENYIMPAN KE CLOUNDINARY
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Dreams_Event/Event",
      },
    });

    const imageOnlyFilter = (request, file, callback) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        callback(null, true);
      } else {
        return callback(new Error("Invalid file extention !"));
      }
    };

    const imageUpload = multer({
      storage,
      limits: { fileSize: 5e5 },
      fileFilter: imageOnlyFilter,
    });

    const upload = imageUpload.single("image");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }

      // Everything went fine.
      next();
    });
  },
};
