const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  // baris baru
  getAllUser: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = +page;
      limit = +limit;

      const totalData = await userModel.getCountUser();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await userModel.getAllUser(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
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
  getUserById: async (request, response) => {
    try {
      const { userId } = request.params;

      const result = await userModel.getUserById(userId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
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
  createUser: async (request, response) => {
    try {
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
      } = request.body;
      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
        role: "admin",
      };

      const result = await userModel.createUser(setData);

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
  updateUser: async (request, response) => {
    try {
      const { userId } = request.params;
      const { name, username, gender, profession, nationality, dateOfBirth } =
        request.body;
      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateUser(userId, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
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

  deleteUser: async (request, response) => {
    try {
      const { userId } = request.params;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      const image = checkId.data[0].image.split(".")[0];
      if (image) {
        await cloudinary.uploader.destroy(image, (result) => {
          // eslint-disable-next-line no-console
          console.log(result);
        });
      }
      const result = await userModel.deleteUser(userId);

      return wrapper.response(
        response,
        200,
        "Success Delete Data",
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
  updatePassword: async (request, response) => {
    try {
      const { oldPassword, confirmPassword, newPassword } = request.body;
      const { userId } = request.params;
      const checkOldPassword = await userModel.getUserById(userId);

      const isValid = await bcrypt.compare(
        oldPassword,
        checkOldPassword.data[0].password
      );
      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password");
      }
      if (newPassword !== confirmPassword) {
        return wrapper.response(response, 400, "Your Password Doesn't Match");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const setData = {
        password: hashedPassword,
        updatedAt: new Date(Date.now()),
      };
      const newResult = await userModel.updatePassword(userId, setData);
      return wrapper.response(
        response,
        201,
        "Success Update Password",
        newResult.data
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
  updateImage: async (request, response) => {
    try {
      const { userId } = request.params;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      let image;
      if (request.file) {
        const { filename, mimetype } = request.file;
        image = filename ? `${filename}.${mimetype.split("/")[1]}` : "";

        if (checkId.data[0].image) {
          cloudinary.uploader.destroy(
            checkId.data[0].image.split(".")[0],
            (result) => result
          );
        }
      }
      if (!request.file) {
        return wrapper.response(response, 404, "Image Must Be Filled");
      }

      const setData = {
        image,
      };
      const result = await userModel.updateUser(userId, setData);
      const newResult = [
        {
          userId: result.data[0].userId,
          image: result.data[0].image,
          createdAt: result.data[0].createdAt,
          updatedAt: result.data[0].updatedAt,
        },
      ];
      return wrapper.response(
        response,
        result.status,
        "Success Update Image",
        newResult
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
