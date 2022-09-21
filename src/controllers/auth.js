const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");
const { sendMail } = require("../utils/mail");

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

      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const setMailOptions = {
        to: email,
        name: username,
        subject: "Email Verification !",
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:3001/api/auth/verif`,
        OTP: `${OTP}`,
      };

      client.setEx(`OTP:${OTP}`, 120, OTP);

      await sendMail(setMailOptions);

      return wrapper.response(
        response,
        200,
        "Register success, please check your email !",
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

      // eslint-disable-next-line prefer-destructuring
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

      // eslint-disable-next-line consistent-return
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
          expiresIn: "72h",
        });
        client.setEx(`refreshToken:${refreshtoken}`, 3600 * 36, refreshtoken);
      });

      return wrapper.response(response, 200, "Success Refresh Token", {
        userId: payload.userId,
        token,
        refreshToken: newRefreshToken,
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
  verif: async (request, response) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { OTP } = request.body;

      if (!OTP) {
        return wrapper.response(response, 400, "OTP must be filled !");
      }

      const checkOTP = await client.get(`OTP:${OTP}`);

      if (checkOTP) {
        return wrapper.response(response, 200, "Verify Success", null);
      }
      return wrapper.response(
        response,
        404,
        "OTP doesn't match, please input the correct one !",
        null
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
