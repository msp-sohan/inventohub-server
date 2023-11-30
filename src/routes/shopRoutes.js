const express = require('express');
const shopController = require('../controllers/shopController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Get all Shops
router.get('/shops', shopController.getAllShop);

// Save shop on DB
router.post('/shops', shopController.saveShop);

// update product limit
router.patch('/shops/limit/:email', shopController.updateLimit);

module.exports = router;
