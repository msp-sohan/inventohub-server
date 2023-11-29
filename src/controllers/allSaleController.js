const AllSalesCollection = require('../models/allSale');
const ProductCollection = require('../models/Product');
const CheckoutCollection = require('../models/checkout');

// Get Total Sale
const totalSales = async (req, res) => {
	try {
		const total = await AllSalesCollection.aggregate([
			{ $unwind: '$salesData' },
			{ $group: { _id: null, totalProducts: { $sum: 1 } } },
		]);
		if (total.length > 0) {
			res.status(200).json({ totalSales: total[0].totalProducts });
		} else {
			res.status(200).json({ totalSales: 0 });
		}
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

// Get Manager Sales collection by pagination
const managerAllSales = async (req, res) => {
	const email = req.params.email;
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;

	try {
		// Get total count of products for email
		const totalProductCount = await AllSalesCollection.aggregate([
			{ $match: { 'salesData.userEmail': email } },
			{ $unwind: '$salesData' },
			{ $group: { _id: null, count: { $sum: 1 } } },
		]).exec();

		const paginateData = await AllSalesCollection.aggregate([
			{ $match: { 'salesData.userEmail': email } },
			{ $unwind: '$salesData' },
			{ $sort: { 'salesData.salesDate': -1 } },
			{ $skip: page * limit },
			{ $limit: limit },
		]).exec();

		res.send({ result: paginateData, totalProductCount: totalProductCount[0]?.count || 0 });
	} catch (error) {
		console.error('Error fetching manager all sales:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Save all sales
const saveSaleAndUpdate = async (req, res) => {
	try {
		const salesData = req.body?.salesData;

		// get all productId from the salesData
		const productIds = salesData.map((data) => data.productId);

		// find products from ProductCollection
		const products = await ProductCollection.find({ _id: { $in: productIds } });

		// Delete products from CheckoutCollection
		await CheckoutCollection.deleteMany({ productId: { $in: productIds } });

		// Update saleCount and decrease productQuantity
		const updateOperations = products.map((product) => ({
			updateOne: {
				filter: { _id: product._id },
				update: {
					$inc: { saleCount: 1, productQuantity: -1 },
				},
			},
		}));

		await ProductCollection.bulkWrite(updateOperations);

		const newSalesData = salesData.map((data) => ({
			...data,
			salesDate: new Date(),
		}));

		const newSale = new AllSalesCollection({ salesData: newSalesData });
		const savedSale = await newSale.save();
		res.status(200).json({ success: true, savedSale });
	} catch (error) {
		console.error('Error updating products:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { saveSaleAndUpdate, managerAllSales, totalSales };
