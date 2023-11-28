const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({}, { strict: false });

const ShopCollection = mongoose.model('Shop', shopSchema);

module.exports = ShopCollection;
