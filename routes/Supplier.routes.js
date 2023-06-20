const supplierController = require("../controllers/Supplier.controller");

const router = require("express").Router();
router.post("/", supplierController.createSupplier);
router.get("/", supplierController.getAllSupplier);
router.delete("/:id", supplierController.deleteTypeSupplier);
module.exports = router;
