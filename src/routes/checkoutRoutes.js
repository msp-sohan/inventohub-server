const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const verifyToken = require('../middleware/verifyToken');
const verifyManager = require('../middleware/verifyManager');

router.get('/checkout/:email', verifyToken, verifyManager, checkoutController.getCheckoutData);
router.put('/checkout', checkoutController.saveCheckout);

module.exports = router;
