const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/checkout/:email', checkoutController.getCheckoutData);
router.post('/checkout', checkoutController.saveCheckout);

module.exports = router;
