const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");

Router.get("/", wishlistController.getAllWishlist);
Router.get("/:wishlistId", wishlistController.getWishlistById);
Router.post("/", wishlistController.createWishlist);

module.exports = Router;
