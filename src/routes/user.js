const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");

Router.get("/", userController.getAllUser);
Router.get("/:userId", userController.getUserById);
Router.post("/", userController.createUser);
Router.patch("/:userId", userController.updateUser);
Router.delete("/:userId", userController.deleteUser);

module.exports = Router;
