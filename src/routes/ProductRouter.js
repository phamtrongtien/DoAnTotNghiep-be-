const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");
router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, authMiddleware, productController.updateProduct)
router.delete('/delete/:id', authMiddleware, productController.deleteProduct);
router.get('/details/:id', authMiddleware, productController.getDetailProduct);
router.get('/alldetails', authMiddleware, productController.getAllDetailProduct);

module.exports = router;