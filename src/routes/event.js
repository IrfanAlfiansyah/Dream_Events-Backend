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
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  eventController.createEvent
);

Router.patch(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  eventController.updateEvent
);

Router.delete(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  eventController.deleteEvent
);

module.exports = Router;
