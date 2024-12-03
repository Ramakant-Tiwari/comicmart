const path = require("path");
const fs = require("fs");

const Product = require("../models/Product");
const Order = require("../models/Order");

async function getProducts(req, res, next) {
  try {
    let products = await Product.find({});
    console.log("ALL products", products);
    res.render("admin/products/all-prods", { products });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  if (!req.file) {
    req.session.error_msg = "Image upload is required.";
    return res.redirect("/admin/products/new"); // Redirects back if no image is uploaded
  }

  const product = new Product({ ...req.body, image: req.file.filename });
  try {
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    console.log("product not found", product);
    if (!product) {
      // If no product is found, throw an error with a custom message and code
      const error = new Error("Product not found");
      throw error;
    }
    res.render("admin/products/update-product", {
      product,
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

async function postUpdateProduct(req, res, next) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // ID from URL parameter
      { ...req.body, image: req.file.filename }, // New data to update (sent in the request body)
      { runValidators: true } // Options: 'new' returns the updated document, 'runValidators' ensures that the validation rules are respected
    );

    if (!updatedProduct) {
      const error = new Error("Product not found");
      throw error;
    }

    // Delete the old image (if it exists)
    const oldImagePath = path.join(
      __dirname,
      "..",
      "products-data",
      updatedProduct.imageUrl
    );
    fs.unlink(oldImagePath, (err) => {
      if (err) throw err;
    });

    res.redirect("/admin/products");
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      const error = new Error("Product not found");
      throw error;
    }
    const oldImagePath = path.join(
      __dirname,
      "..",
      "products-data",
      deletedProduct.imageUrl
    );
    fs.unlink(oldImagePath, (err) => {
      if (err) throw err;
    });
    res.redirect("/admin/products");
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const userOrders = await Order.getAllOrders();
    console.log(userOrders);
    if (!userOrders) {
      const error = new Error("Not Products have been Ordered");
      throw error;
    }
    res.render("admin/orders/order", {
      userOrders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrders(req, res, next) {
  try {
    const { orderid, productid, status } = req.body;
    const result = await Order.updateProductStatus(orderid, productid, status);
    if (!result) {
      throw new Error("Not updated!!!");
    }
    res.status(201).json({message: "Order Info Updated"});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  postUpdateProduct,
  deleteProduct,
  getOrders,
  updateOrders
};
