const productModel = require("../models/product");
const wrapper = require("../utils/wrapper");

module.exports = {
  showGreetings: async (req, res) => {
    try {
      res.status(200).send("Hello World!");
    } catch (error) {
      console.log(error);
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const result = await productModel.getAllProduct();
      return wrapper.response(
        res,
        result.status,
        "Success Get Data !",
        result.data
      );
    } catch (error) {
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};
