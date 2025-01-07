const express = require("express");
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware");
router.post('/create', orderController.createOrder)

router.get('/get-order-details/:id', authUserMiddleware, orderController.getDetailOrder)
router.delete('/delete-order/:id', orderController.deleteOrder);
router.get('/get-all-order', authMiddleware, orderController.getAllOrder)
router.put('/update-delivery/:orderId', authMiddleware, orderController.updateDelivery);
router.put('/update-payment/:orderId', orderController.updatePaymentStatus);
module.exports = router;