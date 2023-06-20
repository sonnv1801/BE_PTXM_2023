const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  deliveredDate: {
    type: Date,
    default: Date.now,
  },
});

const purchaseSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductSupplier",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  deliveries: [deliverySchema],
  date: {
    type: Date,
    default: Date.now,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
