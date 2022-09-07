const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");

Router.post("/", bookingController.createBooking);
Router.get("/", bookingController.getAllBooking);

module.exports = Router;
