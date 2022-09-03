const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");

Router.post("/", bookingController.createBooking);

module.exports = Router;
