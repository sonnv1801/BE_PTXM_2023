const product = require("../controllers/Product.controller");
const upload = require("../utils/multer");

const router = require("express").Router();

router.get("/", product.getAllProduct);
router.get("/more-products", product.getMoreProducts);
router.get("/:id", product.getProductById);
router.post("/", upload.single("image"), product.createProduct);
router.put("/:id", upload.single("image"), product.updateProduct);
router.delete("/:id", product.deleteProduct);
router.get("/products/:type/:limit", product.getProductByType);
module.exports = router;
