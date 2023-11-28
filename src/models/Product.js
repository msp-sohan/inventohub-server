const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({}, { strict: false });

const ProductCollection = mongoose.model('Product', productSchema);

module.exports = ProductCollection;
