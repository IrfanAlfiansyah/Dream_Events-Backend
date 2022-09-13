const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadFile");

Router.get("/", eventController.getAllEvent);

Router.get("/:eventId", eventController.getEventById);

Router.post(
  "/",
  authMiddleware.authentication,
  uploadMiddleware.uploadEvent,
  eventController.createEvent
);

Router.patch("/:eventId", eventController.updateEvent);

Router.delete("/:eventId", eventController.deleteEvent);

module.exports = Router;
