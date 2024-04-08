const purchaseProductController = require("../controllers/PurchaseProduct.controller");
const upload = require("../utils/multer");

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
router.get(
  "/orders/products/more-products",
  purchaseProductController.getMoreProductsToOrder
);

router.delete(
  "/products/:productId",
  purchaseProductController.deleteProductToOrder
);

router.get(
  "/orders/products/:productId",
  purchaseProductController.getAllProductToOrderById
);

router.put(
  "/orders/products/:productId",
  upload.single("image"),
  purchaseProductController.updateProductToOrderById
);
module.exports = router;
