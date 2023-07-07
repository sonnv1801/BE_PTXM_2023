const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  images: String,
  productCode: String,
  price: Number,
  oldPrice: Number,
  status: String,
  quantity: Number,
  remainingQuantity: Number,
});

const comboSchema = new mongoose.Schema({
  image: String,
  quantity: Number,
  title: String,
  type: String,
  link: String,
  products: [productSchema],
  newPrice: Number,
  status: String,
});

module.exports = mongoose.model("Combo", comboSchema);
