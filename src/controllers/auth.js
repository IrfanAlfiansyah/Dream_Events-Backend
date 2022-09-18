const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");

module.exports = {
  register: async (request, response) => {
    try {
      const { username, email, password } = request.body;

      const result = await authModel.getUserByEmail(email);

      if (result.data.length >= 1) {
        return wrapper.response(
          response,
          result.status,
          "Your input email already used!"
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const setData = {
        username,
        email,
        password: hashedPassword,
        role: "admin",
      };
      const newResult = await authModel.register(setData);
      return wrapper.response(
        response,
        newResult.status,
        "Register Success",
        newResult.data.map((el) => el.userId)
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

  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registered", null);
      }

      // 2. PROSES PENCOCOKAN PASSWORD
      const isValid = await bcrypt.compare(
        password,
        checkEmail.data[0].password
      );
      if (!isValid) {
        return wrapper.response(
          response,
          400,
          "Email or password is wrong",
          null
        );
      }

      const payload = {
        userId: checkEmail.data[0].userId,
        role: !checkEmail.data[0].role ? "user" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_KEYS, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "72h",
      });

      return wrapper.response(response, 200, "Success Login", {
        userId: payload.userId,
        token,
        refreshToken,
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshtoken } = request.headers;

      token = token.split(" ")[1];
      client.setEx(`accessToken:${token}`, 3600 * 48, token);
      client.setEx(`refreshToken:${refreshtoken}`, 3600 * 48, refreshtoken);

      return wrapper.response(response, 200, "Success Logout", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  refresh: async (request, response) => {
    try {
      const { refreshtoken } = request.headers;

      if (!refreshtoken) {
        return wrapper.response(response, 400, "Refresh Token Must Be Filled");
      }

      const checkTokenBlacklist = await client.get(
        `refreshToken:${refreshtoken}`
      );

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your token is destroyed please login again",
          null
        );
      }

      let payload;
      let token;
      let newRefreshToken;

      jwt.verify(refreshtoken, process.env.REFRESH_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }
        payload = {
          userId: result.userId,
          role: result.role,
        };
        token = jwt.sign(payload, process.env.ACCESS_KEYS, {
          expiresIn: "30s",
        });
        newRefreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
          expiresIn: "36h",
        });
        client.setEx(`refreshToken:${refreshtoken}`, 3600 * 36, refreshtoken);
      });

      return wrapper.response(response, 200, "Success Refresh Token", {
        userId: payload.userId,
        token,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
