const Order = require("../models/Order");

async function getOrders(req, res, next) {
  try {
    const userOrders = await Order.getOrders(res.locals.uid);
    if (!userOrders) {
      const error = new Error("Not Products have been Ordered");
      throw error;
    }
    res.render("customer/orders/order", {
      userOrders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  try {
    const cart = res.locals.cart;
    // const userDocument = await User.findById(res.locals.uid);
    const order = await Order.save(cart, res.locals.uid);
    req.session.cart = null;
    res.redirect("/orders");
  } catch (error) {
    next(error);
  }
}

module.exports = { addOrder, getOrders };
