const express = require('express');
const router = express.Router();
const allSalesController = require('../controllers/allSaleController');
const verifyToken = require('../middleware/verifyToken');
const verifyManager = require('../middleware/verifyManager');

router.get('/totalsales', verifyToken, allSalesController.totalSales);
router.get('/allsales/:email', verifyToken, allSalesController.managerAllSales);
router.post('/allsales', allSalesController.saveSaleAndUpdate);

module.exports = router;
