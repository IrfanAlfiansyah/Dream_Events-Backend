const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post("/refresh", authController.refresh);
Router.get("/verif/OTP", authController.verif);
Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword", authController.resetPassword);

module.exports = Router;
