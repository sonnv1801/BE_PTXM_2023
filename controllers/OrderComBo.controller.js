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

  getHistoryOrder: async (req, res) => {
    const customerId = req.params.customerId;
    try {
      // Tìm các đơn hàng của khách hàng theo customerId, sắp xếp giảm dần theo ngày đặt hàng
      const orders = await OrderCombo.find({ customerId: customerId })
        .sort({ _id: -1 })
        .limit(1);

      if (orders.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn hàng cho khách hàng này." });
      }

      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu." });
    }
  },
  deleteOrderComboById: async (req, res) => {
    try {
      const deletedOrderCombo = await OrderCombo.findByIdAndDelete(
        req.params.id
      );

      if (!deletedOrderCombo) {
        return res
          .status(404)
          .json({ message: "Không Tìm Thấy Order Theo ID Này" });
      }

      return res.status(200).json({ message: "Xóa Order Thành Công!" });
    } catch (error) {
      return res.status(500).json({
        message: "Xóa Order Không Thành Công!",
        error: error.message,
      });
    }
  },
  getInfoCustomerById: async (req, res) => {
    try {
      const order = await OrderCombo.findById(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ error: "Không Tìm Thấy Thông Tin Theo Id " });
      }

      // Return the order details
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error." });
    }
  },
};

module.exports = orderComboController;
