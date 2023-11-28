const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({}, { strict: false });

const SalesCollection = mongoose.model('Sales', salesSchema);

module.exports = SalesCollection;
