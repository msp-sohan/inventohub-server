const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const verifyToken = require('../middleware/verifyToken');
const verifyManager = require('../middleware/verifyManager');

router.get('/sale', salesController.allSales);
router.get('/sales/:email', verifyToken, verifyManager, salesController.managerSales);
router.post('/sales', salesController.saveSales);

module.exports = router;
