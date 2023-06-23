const express = require("express");
const comboController = require("../controllers/Combo.controller");
const router = require("express").Router();
const upload = require("../utils/multer");
router.get("/", comboController.getAllCombo);
router.get("/:id", comboController.getComBoById);
router.post("/", comboController.createCombo);
router.put("/:id", comboController.updateComboByID);
router.post("/addcombo/:comboId", comboController.addAdditionalProductsToCombo);
router.put("/:comboId/product/:productId", comboController.UpdateToCombo);
router.put("/combos/:comboId", comboController.UpdateToCombo);
router.delete("/:id", comboController.DeleteComboByID);
router.get("/combos/:typeCombo/:limit", comboController.getComBoByLink);

router.put("/combo/:id/reduce", comboController.reduceComboQuantity);

router.get(
  "/combos/products/product/:id",
  comboController.getDetailProductByID
);

module.exports = router;
