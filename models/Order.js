const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productCode: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      supplier: {
        type: String,
        required: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
      retailPrice: {
        type: Number,
        required: true,
      },
      wholesalePrice: {
        type: Number,
        required: true,
      },
      wholesalePriceQuick: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      quantityOrdered: {
        type: Number,
        required: true,
      },
      quantityDelivered: {
        type: Number,
        default: 0,
      },
      deliveryStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      productPrice: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      productProfit: {
        type: Number,
        default: 0,
      },
      totalProfit: {
        type: Number,
        default: 0,
      },
      quantityPurchased: {
        type: Number,
        default: 0,
      },
      fastDelivery: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
