const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");

module.exports = {
  // eslint-disable-next-line consistent-return
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;
      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }
      // eslint-disable-next-line prefer-destructuring
      token = token.split(" ")[1];
      const checkTokenBlacklist = await client.get(`accessToken:${token}`);

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your token was destroyed please login again",
          null
        );
      }

      // eslint-disable-next-line consistent-return
      jwt.verify(token, process.env.ACCESS_KEYS, (error, payload) => {
        if (error) {
          return wrapper.response(response, 403, error, null);
        }
        const { userId, email, role } = payload;
        request.userPayload = { userId, email, role };
        next();
      });
    } catch (error) {
      return wrapper.response(response, 400, error, null);
    }
  },

  // eslint-disable-next-line consistent-return
  isAdmin: (request, response, next) => {
    const { role } = request.userPayload;

    if (role !== "admin") {
      return wrapper.response(
        response,
        401,
        "You Can Not Access This Page !",
        null
      );
    }
    next();
  },
};
