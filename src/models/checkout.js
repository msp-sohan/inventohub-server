const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({}, { strict: false });

const CheckoutCollection = mongoose.model('Checkout', checkoutSchema);

module.exports = CheckoutCollection;
