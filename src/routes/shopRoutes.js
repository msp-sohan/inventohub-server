const express = require('express');
const shopController = require('../controllers/shopController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Get all Shops
router.get('/shops', verifyToken, shopController.getAllShop);

// Save shop on DB
router.post('/shops', shopController.saveShop);

// update product limit
router.patch('/shops/limit/:email', shopController.updateLimit);

module.exports = router;
