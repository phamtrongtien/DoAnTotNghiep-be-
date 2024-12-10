const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");
router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, authMiddleware, productController.updateProduct)
router.delete('/delete/:id', authMiddleware, productController.deleteProduct);
router.get('/details/:id', productController.getDetailProduct);
router.get('/alldetails', productController.getAllDetailProduct);
router.get('/get-all-type', productController.getAllTypeProduct);
router.put('/update-rating/:id', productController.updateProductRating);

module.exports = router;