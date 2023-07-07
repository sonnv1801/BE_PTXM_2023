const express = require("express");
const comboController = require("../controllers/Combo.controller");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", comboController.getAllCombo);
router.get("/:id", comboController.getComBoById);
router.post("/create", upload.single("image"), comboController.createCombo);
router.put("/:id", comboController.updateComboByID);
router.post(
  "/combo/:comboId/products",
  upload.single("image"),
  comboController.addAdditionalProductsToCombo
);
// router.put("/:comboId/product/:productId", comboController.UpdateToCombo);
router.delete(
  "/combo/:comboId/product/:productId",
  comboController.deleteProductFromCombo
);
router.put(
  "/combos/:comboId",
  upload.single("image"),
  comboController.UpdateToCombo
);
router.delete("/:id", comboController.DeleteComboByID);
router.get("/combos/:typeCombo/:limit", comboController.getComBoByLink);

router.put("/combo/:id/reduce", comboController.reduceComboQuantity);

router.get(
  "/combos/products/product/:id",
  comboController.getDetailProductByID
);

module.exports = router;
