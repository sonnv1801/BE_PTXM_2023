const orderComboController = require("../controllers/OrderComBo.controller");
const router = require("express").Router();
router.post("/", orderComboController.createCombo);
router.get("/:customerId", orderComboController.getComboByCustomerID);
router.get("/", orderComboController.getAllOrder);
module.exports = router;
