const { OrderCombo } = require("../models/OrderComBo");

const orderComboController = {
  createCombo: async (req, res) => {
    try {
      // Extract the order data from the request body
      const orderData = req.body;

      // Create a new order using the OrderCombo model
      const order = new OrderCombo(orderData);

      // Save the order to the database
      const savedOrder = await order.save();

      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create order" });
    }
  },

  getComboByCustomerID: async (req, res) => {
    const { customerId } = req.params;

    try {
      const orders = await OrderCombo.find({ customerId });
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  },
  getAllOrder: async (req, res) => {
    try {
      const products = await OrderCombo.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = orderComboController;
