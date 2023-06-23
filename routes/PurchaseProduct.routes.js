const purchaseProductController = require("../controllers/PurchaseProduct.controller");

const router = require("express").Router();
router.post("/", purchaseProductController.purchaseProduct);
router.get("/:id", purchaseProductController.GetOrderByIdUser);
router.get("/", purchaseProductController.getAllOrder);
router.get("/products/:type", purchaseProductController.getProductsByType);
router.get(
  "/products/byid/:productId",
  purchaseProductController.getProductById
);
router.post(
  "/products/buy/:productId",
  purchaseProductController.purchaseProductQuantity
);
router.get("/api/products", purchaseProductController.getAllProductsByOrder);

router.get("/orders/products", purchaseProductController.getAllProductToOrder);
module.exports = router;
