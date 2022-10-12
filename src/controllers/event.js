const eventModel = require("../models/event");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");
const client = require("../config/redis");

module.exports = {
  getAllEvent: async (request, response) => {
    try {
      let { page, limit, sort, searchDate, name } = request.query;
      page = +page;
      limit = +limit;
      sort = `${sort}`;
      searchDate = `${searchDate}`;
      name = `${name}`;

      const totalData = await eventModel.getCountEvent();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      let sortColumn = "dateTimeShow";
      let sortType = "asc";
      if (sort) {
        // eslint-disable-next-line prefer-destructuring
        sortColumn = sort.split(" ")[0];
        // eslint-disable-next-line prefer-destructuring
        sortType = sort.split(" ")[1];
      }
      if (sortType.toLowerCase() === "asc") {
        sortType = true;
      } else {
        sortType = false;
      }

      let day;
      let nextDay;
      if (searchDate) {
        searchDate = new Date(searchDate);
        day = new Date(new Date(searchDate).setDate(searchDate.getDate() - 1));
        nextDay = new Date(new Date(day).setDate(day.getDate() + 2));
      }

      const result = await eventModel.getAllEvent(
        offset,
        limit,
        sortColumn,
        sortType,
        day,
        nextDay,
        name
      );
      client.setEx(
        `getEvent:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result: result.data, pagination })
      );

      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
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
  getEventById: async (request, response) => {
    try {
      const { eventId } = request.params;

      const result = await eventModel.getEventById(eventId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
          []
        );
      }

      client.setEx(`getEvent:${eventId}`, 3600, JSON.stringify(result.data));

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
  createEvent: async (request, response) => {
    try {
      if (request.file === null) {
        return wrapper.response(response, 400, "Image must be filled", null);
      }
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const { filename } = request.file;

      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
        image: filename ? `${filename}` : "",
      };

      const result = await eventModel.createEvent(setData);

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
  updateEvent: async (request, response) => {
    try {
      const { eventId } = request.params;
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const { filename, mimetype } = request.file;

      const checkId = await eventModel.getEventById(eventId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
          []
        );
      }

      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
        updatedAt: new Date(Date.now()),
      };

      const imageId = checkId.data[0].image.split(".")[0];
      if (request.file) {
        await cloudinary.uploader.destroy(imageId, (result) => {
          // eslint-disable-next-line no-console
          console.log(result);
        });
      }

      const result = await eventModel.updateEvent(eventId, setData);

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
  deleteEvent: async (request, response) => {
    try {
      const { eventId } = request.params;

      const checkId = await eventModel.getEventById(eventId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
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
      await eventModel.deleteEvent(eventId);

      return wrapper.response(response, 200, "Success Delete Data");
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
