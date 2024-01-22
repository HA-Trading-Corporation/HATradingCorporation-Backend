const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please enter the reviewer's name"],
  },
  comment: {
    type: String,
    required: [true, "Please enter a review comment"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be greater than 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const product_schema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    require: [true, "Please enter product description"],
    trim: true,
  },
  category: {
    type: String,
    require: [true, "Please enter product category"],
  },
  imageUrls: [
    {
      secureUrl: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
  stocks: {
    type: Number,
    require: [true, "please enter product stocks"],
  },
  price: {
    type: Number,
    require: [true, "Please enter product price"],
    min: [0, "Price cannot be negative"],
  },
  stars: {
    type: Number,
    default: 0,
    min: [0, "Stars cannot be negative"],
    max: [5, "Stars cannot be greater than 5"],
  },
  reviews: [reviewSchema],
});

const Product = new mongoose.model("Products", product_schema);

module.exports = Product;
