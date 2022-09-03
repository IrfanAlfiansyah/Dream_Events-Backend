const { request } = require("express");
const wishlistModel = require("../models/wishlist");
const wrapper = require("../utils/wrapper");

module.exports = {
  getAllWishlist: async (request, response) => {
    try {
      const result = await wishlistModel.getAllWishlist();
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getWishlistById: async (request, response) => {
    try {
      const { wishlistId } = request.params;

      const result = await wishlistModel.getWishlistById(wishlistId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${wishlistId} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By Id",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  createWishlist: async (request, response) => {
    try {
      const { eventId, userId } = request.body;
      const setData = {
        eventId,
        userId,
      };

      const result = await wishlistModel.createWishlist(setData);

      return wrapper.response(
        response,
        result.status,
        "Success Create Data",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
