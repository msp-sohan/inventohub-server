const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all Product
router.get('/products', productController.getProduct);
// Get A User Product
router.get('/products/:email', productController.getAllProduct);
// Save Products on DB
router.post('/products', productController.saveProduct);
// Update Product on DB
router.put('/product/:id', productController.updateProduct);
// Delete a Product
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;
