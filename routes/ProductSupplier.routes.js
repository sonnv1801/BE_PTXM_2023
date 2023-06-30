const productSupplierController = require("../controllers/ProductSupplier.controller");
const upload = require("../utils/multer");
const router = require("express").Router();
router.post(
  "/",
  upload.single("image"),
  productSupplierController.createProduct
);
router.put(
  "/:id",
  upload.single("image"),
  productSupplierController.updateProductSupplier
);

router.post("/addmanyproduct", productSupplierController.createManyProduct);

router.delete("/:id", productSupplierController.deleteProductSupplier);
router.get("/:link/:limit", productSupplierController.getProductByLink);
router.get("/:id", productSupplierController.getProductById);
router.get("/", productSupplierController.getAllProductSupplier);
module.exports = router;
