const Product = require("../models/Product");

async function getAllProduct(req, res, next) {
  try {
    let products = await Product.find({});
    res.render("customer/products/all-prods", { products });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      // If no product is found, throw an error with a custom message and code
      const error = new Error("Product not found");
      throw error;
    }
    res.render("customer/products/product-details", {
      product,
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

module.exports = { getAllProduct, getProduct };
