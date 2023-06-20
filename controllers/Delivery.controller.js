const ProductSupplier = require("../models/ProductSupplier");
const Order = require("../models/Order");
const PurchaseHistory = require("../models/PurchaseHistory");
const Customer = require("../models/User");
const deliveryController = {
  deliveryProductMissing: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { productCode, quantity, customerId } = req.body;

      // Kiểm tra đơn đặt hàng có tồn tại hay không
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Không tìm thấy đơn đặt hàng có ID '${orderId}'.`);
      }

      // Kiểm tra số lượng sản phẩm còn lại trong đơn đặt hàng
      const orderProduct = order.products.find(
        (p) => p.productCode === productCode
      );
      if (!orderProduct) {
        throw new Error(
          `Không tìm thấy sản phẩm có mã '${productCode}' trong đơn đặt hàng.`
        );
      }

      const remainingQuantity =
        orderProduct.quantityOrdered - orderProduct.quantityDelivered;
      if (remainingQuantity === 0) {
        throw new Error(
          `Đơn đặt hàng đã được giao đủ số lượng cho sản phẩm có mã '${productCode}'.`
        );
      }

      // Kiểm tra số lượng giao không vượt quá số lượng thiếu
      if (quantity > remainingQuantity) {
        throw new Error(
          `Số lượng giao không được vượt quá số lượng thiếu (${remainingQuantity}).`
        );
      }

      // Lấy thông tin khách hàng từ cơ sở dữ liệu
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw new Error(`Không tìm thấy khách hàng có ID '${customerId}'.`);
      }

      // Lấy thông tin sản phẩm từ nhà cung cấp
      const productSupplier = await ProductSupplier.findOne({
        productCode: productCode,
      });
      if (!productSupplier) {
        throw new Error(
          `Không tìm thấy thông tin sản phẩm có mã '${productCode}' từ nhà cung cấp.`
        );
      }

      // Giao hàng
      const quantityToDeliver = Math.min(quantity, productSupplier.quantity);
      if (quantityToDeliver === 0) {
        throw new Error(
          `Sản phẩm có mã '${productCode}' không còn hàng hoặc không đủ số lượng giao.`
        );
      }

      // Ghi nhận giao hàng
      const delivery = {
        orderId: orderId,
        productCode: productCode,
        quantity: quantityToDeliver,
        deliveryDate: Date.now(),
        customerId: customerId,
        customerName: customer.fullname,
      };
      const purchaseHistory = new PurchaseHistory(delivery);
      await purchaseHistory.save();

      // Cập nhật số lượng đã giao và số lượng còn lại của sản phẩm từ nhà cung cấp
      productSupplier.quantity -= quantityToDeliver;
      await productSupplier.save();

      // Cập nhật số lượng đã giao và trạng thái giao hàng trong đơn đặt hàng
      orderProduct.quantityDelivered += quantityToDeliver;
      if (orderProduct.quantityDelivered >= orderProduct.quantityOrdered) {
        orderProduct.deliveryStatus = "completed";
      }

      // Cập nhật thông tin tổng số lượng, tổng giá trị và tổng lợi nhuận trong đơn đặt hàng
      order.totalQuantity += quantityToDeliver;
      order.totalPrice += orderProduct.productPrice * quantityToDeliver;
      order.totalProfit += orderProduct.productProfit * quantityToDeliver;

      // Cập nhật thời gian cập nhật mới nhất
      order.updated_at = Date.now();

      await order.save();

      res.json({ message: "Giao hàng thành công." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getHistoriesByUser: async (req, res) => {
    const { customerId, orderId } = req.params;
    try {
      const histories = await PurchaseHistory.find({
        customerId: customerId,
        orderId: orderId,
      });

      if (!histories) {
        return res.status(404).json({ error: "Không tìm thấy" });
      } else {
        return res.json(histories);
      }
    } catch (error) {
      console.error("Lỗi truy vấn MongoDB:", error);
      return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
    }
  },
};

module.exports = deliveryController;
