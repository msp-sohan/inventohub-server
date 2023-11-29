const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({}, { strict: false });

const AllSalesCollection = mongoose.model('AllSales', salesSchema);

module.exports = AllSalesCollection;
