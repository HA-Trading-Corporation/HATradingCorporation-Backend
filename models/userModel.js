const mongoose = require("mongoose");

const cart = new mongoose.Schema({
  product: {
    id: { type: String },
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    image: { type: String },
  },
  stocks: { type: Number },
  quantity: { type: Number },
});

const wishlist = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  image: { type: String },
});

const user_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },

  // address

  fullName: {
    type: String,
  },
  province: {
    type: String,
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
  address: {
    type: String,
  },
  // cart
  wishlist: [wishlist],
  cart: [cart],
});

const User = new mongoose.model("Users", user_schema);
module.exports = User;
