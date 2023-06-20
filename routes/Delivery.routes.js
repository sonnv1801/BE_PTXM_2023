const router = require("express").Router();
const purchaseController = require("../controllers/Delivery.controller");

// Route để mua hàng
router.post("/:orderId", purchaseController.deliveryProductMissing);
router.get("/:customerId/:orderId", purchaseController.getHistoriesByUser);

module.exports = router;
