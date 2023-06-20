const typeComboController = require("../controllers/TypeCombo.controller");

const router = require("express").Router();

router.get("/", typeComboController.getAllTypeComBo);
router.post("/", typeComboController.createTypeComBo);
router.delete("/:id", typeComboController.deleteTypeComBo);

module.exports = router;
