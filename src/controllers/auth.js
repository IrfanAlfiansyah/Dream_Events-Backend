const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");

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
        role: "user",
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

      const token = jwt.sign(payload, "RAHASIA", { expiresIn: "24h" });
      // 4. PROSES REPON KE USER
      return wrapper.response(response, 200, "Success Login", {
        userId: payload.userId,
        token,
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
};
