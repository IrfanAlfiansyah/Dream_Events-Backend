const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");

// Router.get("/greetings", (request, response) => {
//   response.status(200).send("Hello World!");
// });

Router.get("/greetings", productController.showGreetings);
Router.get("/", productController.getAllProduct);
Router.get("/:id", productController.getProductById);
Router.post("/", productController.createProduct);

module.exports = Router;
