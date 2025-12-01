const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // required
    trim: true,
  },
  description: {
    type: String,
    required: true, // required
    trim: true,
  },
  price: {
    type: Number,
    required: true, // required
    min: [0, "Price must be greater than 0"], // > 0
  },
  category: {
    type: String,
    required: true, // required
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true, // defaults to true
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // current date/time
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
