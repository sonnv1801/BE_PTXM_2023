const mongoose = require("mongoose");

const productSupplierSchema = new mongoose.Schema({
  image: {
    type: String,
    // require: true,
  },
  agentCode: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  productCode: {
    type: String,
    require: true,
  },
  salePrice: {
    type: Number,
    require: true,
  },
  retailPrice: {
    type: Number,
    require: true,
  },
  wholesalePrice: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
  supplier: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductSupplier", productSupplierSchema);
