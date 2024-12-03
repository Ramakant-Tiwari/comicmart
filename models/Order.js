const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User model
  productsData: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      }, // Reference to Product model
      quantity: { type: Number, required: true }, // Quantity of the product ordered
      totalPrice: { type: Number, required: true }, // Total price for the quantity ordered
      status: {
        type: String,
        default: "pending", // Default to "pending"
      },
      date: { type: Date, default: Date.now }, // Default to current date
    },
  ],
});

const OrderModel = mongoose.model("Order", orderSchema);

class Order {
  static async getOrders(userData) {
    try {
      const userOrders = await OrderModel.find({ userData }).populate(
        "productsData.product"
      );
      if (!userOrders) {
        const error = new Error("Not Products have been Ordered");
        throw error;
      }
      return userOrders.reverse();
    } catch (error) {
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const allOrders = await OrderModel.find({}).populate(
        "productsData.product"
      );
      if (allOrders) {
        return allOrders.reverse();
      } else {
        throw new Error("Product not found in this order");
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateProductStatus(orderid, productid, status) {
    try {
      const existingOrder = await OrderModel.findById(orderid);
      if (existingOrder) {
        const product = existingOrder.productsData.find(
          (item) => item.product.toString() === productid
        );
        if (product) {
          product.status = status; // Update the status of the individual product
          await existingOrder.save();
          return true;
        } else {
          throw new Error("Product not found in this order");
        }
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      throw error;
    }
  }

  // Save method to store the order in the database
  static async save(cart, userData) {
    try {
      const newOrder = new OrderModel({
        userData: userData,
        productsData: cart.items.map((item) => ({
          product: item.product._id, // Store product ID
          quantity: item.quantity, // Store product quantity
          totalPrice: item.totalPrice, // Store total price for the item,
          status: "pending", // Default status
        })),
      });
      await newOrder.save();
      return newOrder;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  }
}

module.exports = Order;
