const orderComboController = require('../controllers/OrderComBo.controller');
const router = require('express').Router();
router.post('/', orderComboController.createCombo);
router.get('/:customerId', orderComboController.getComboByCustomerID);
router.get('/', orderComboController.getAllOrder);
router.get('/history/:customerId', orderComboController.getHistoryOrder);
module.exports = router;
