const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadProfile");

Router.get("/", authMiddleware.authentication, userController.getAllUser);

Router.get(
  "/:userId",
  authMiddleware.authentication,
  userController.getUserById
);

Router.post("/", authMiddleware.authentication, userController.createUser);

Router.patch(
  "/:userId",
  authMiddleware.authentication,
  userController.uploadImage
);

Router.post(
  "/:userId",
  authMiddleware.authentication,
  userController.uploadImage
);

Router.delete(
  "/:userId",
  authMiddleware.authentication,
  userController.deleteUser
);

module.exports = Router;
