const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadFile");
const redisMiddleware = require("../middleware/redis");

Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.getAllEvent,
  eventController.getAllEvent
);

Router.get(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.getEventById,
  eventController.getEventById
);

Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  redisMiddleware.clearEvent,
  eventController.createEvent
);

Router.patch(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  redisMiddleware.clearEvent,
  eventController.updateEvent
);

Router.delete(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearEvent,
  eventController.deleteEvent
);

module.exports = Router;
