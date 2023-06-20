const purchaseProductController = require("../controllers/PurchaseProduct.controller");

const router = require("express").Router();
router.post("/", purchaseProductController.purchaseProduct);
router.get("/:id", purchaseProductController.GetOrderByIdUser);
router.get("/", purchaseProductController.getAllOrder);
module.exports = router;
