const mongoose = require("mongoose");

const productsingleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  newPrice: { type: Number, required: true },
  quantity_cart: { type: Number, required: true },
});

// Define schema for the Product collection
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  productCode: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  total: { type: Number, required: true },
});

// Define schema for the Combo collection
const comboSchema = new mongoose.Schema({
  quantityCombo: { type: Number, required: true },
  image: { type: String, required: true },
  comboName: { type: String, required: true },
  quantity: { type: Number, required: true },
  products: [productSchema],
  subtotal: { type: Number, required: true },
  totalPrice: { type: Number },
});

// Define schema for the OrderCombo collection
const orderComboSchema = new mongoose.Schema({
  products: [productsingleSchema],
  combos: [comboSchema],
  totalOrderPrice: { type: Number },
  customerId: { type: String },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String }, // Thêm trường totalOrderPrice để lưu tổng tiền của đơn hàng
});

// Create the OrderCombo model
const OrderCombo = mongoose.model("OrderCombo", orderComboSchema);

module.exports = { OrderCombo };
