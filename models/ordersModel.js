const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // Define your product fields here
  // For example, if a product has a name and price:
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  // Add other fields as needed
});

const orders_schema = new mongoose.Schema({
  userId: { type: String, required: true, default: "default" },
  status: {
    type: String,
    default: "processing",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  province: { type: String, required: true },
  city: { type: String, required: true },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderedProducts: [
    {
      product: productSchema, // Embedded product schema
      quantity: { type: Number, required: true },
      status: {
        type: String,
        default: "processing",
        required: true,
      },
    },
  ],
});

const Orders = new mongoose.model("Order", orders_schema);

module.exports = Orders;
