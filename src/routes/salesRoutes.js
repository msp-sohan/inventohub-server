const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/sale', salesController.allSales);
router.get('/sales', salesController.managerSales);
router.post('/sales', salesController.saveSales);

module.exports = router;
