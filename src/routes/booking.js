const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get("/", authMiddleware.authentication, bookingController.getAllBooking);
Router.get(
  "/:eventId",
  authMiddleware.authentication,
  bookingController.getBookingByEventId
);

module.exports = Router;
