const Product = require("../models/Product");

function getCart(req, res, next) {
  try {
    res.render("customer/cart/cart");
  } catch (err) {
    next(err);
  }
}

async function addCartItem(req, res, next) {
  try {
    const product = await Product.findById(req.body.productid);
    if (!product) throw new Error("Product not found");

    res.locals.cart.addItem(product);
    req.session.cart = res.locals.cart;
    res.status(201).json({
      message: "Cart Updated",
      newTotalItems: res.locals.cart.totalQuantity,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const product = await Product.findById(req.body.productid);
    if (!product) throw new Error("Product not found");

    const { updatedPrice } = res.locals.cart.updateCartItem(
      product,
      req.body.newQuantity
    );

    req.session.cart = res.locals.cart;
    res.status(201).json({
      message: "Cart Item Updated",
      updatedCartData: {
        newTotalQuantity: res.locals.cart.totalQuantity,
        newTotalPrice: res.locals.cart.totalPrice,
        newItemTotalPrice: updatedPrice,
      },
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { addCartItem, getCart, updateCartItem };