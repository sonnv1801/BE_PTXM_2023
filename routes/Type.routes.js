const typeController = require("../controllers/Type.controller");

const router = require("express").Router();

router.get("/", typeController.getAllTypeComBo);
router.post("/", typeController.createTypeComBo);
router.delete("/:id", typeController.deleteTypeComBo);

module.exports = router;
