const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");

// Router.get("/greetings", (request, response) => {
//   response.status(200).send("Hello World!");
// });

Router.get("/greetings", productController.showGreetings);
Router.get("/", productController.getAllProduct);

module.exports = Router;
