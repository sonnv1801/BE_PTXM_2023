const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerName: {
    type: String,
  },
});

module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);
