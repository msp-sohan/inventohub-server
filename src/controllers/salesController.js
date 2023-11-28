const SalesCollection = require('../models/Sale');
const ProductCollection = require('../models/Product');
const CheckoutCollection = require('../models/checkout');
const mongoose = require('mongoose');

// Get All sales
const allSales = async (req, res) => {
	const result = await SalesCollection.find();
	res.send(result);
};

// Get Manager Sales collection by pagination
const managerSales = async (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);

	const result = await SalesCollection.find()
		.skip(page * limit)
		.limit(limit)
		.exec();

	const saleCount = await SalesCollection.countDocuments();
	res.send({ result, saleCount });
};

// Save Sales Collection on db
const saveSales = async (req, res) => {
	const salesData = req.body;

	salesData.salesDate = new Date();

	try {
		const newSale = new SalesCollection(salesData);
		const savedSale = await newSale.save();

		const productId = new mongoose.Types.ObjectId(salesData?.productId);
		const foundProduct = await ProductCollection.findById(productId);
		console.log('first', foundProduct);

		if (!foundProduct) {
			return res.status(404).send({ error: 'Product not found' });
		}

		await ProductCollection.findByIdAndUpdate(
			{ _id: productId },
			{
				$inc: { productQuantity: -1, saleCount: 1 },
			},
			{
				new: true,
			},
		);
		const clearCheckout = await CheckoutCollection.findOneAndDelete({
			productId: salesData?.productId,
		});

		res.status(200).send({ savedSale, clearCheckout });
	} catch (error) {
		console.error('Error saving Sales:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { saveSales, managerSales, allSales };
