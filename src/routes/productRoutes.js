const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyManager = require('../middleware/verifyManager');

// Get all Product
router.get('/products', verifyToken, productController.getProduct);
// Get A User Product
router.get('/products/:email', verifyToken, verifyManager, productController.getAllProduct);
// Save Products on DB
router.post('/products', verifyToken, verifyManager, productController.saveProduct);
// Update Product on DB
router.put('/product/:id', verifyToken, verifyManager, productController.updateProduct);
// Delete a Product
router.delete('/product/:id', verifyToken, verifyManager, productController.deleteProduct);

module.exports = router;
