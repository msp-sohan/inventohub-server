const CheckoutCollection = require('../models/checkout');

const getCheckoutData = async (req, res) => {
	const email = req?.params?.email;
	const result = await CheckoutCollection.find({ userEmail: email });
	res.send(result);
};

// Save check out data to db
const saveCheckout = async (req, res) => {
	const checkoutData = req.body;
	const productId = checkoutData?.productId;

	try {
		// Check if the product exists
		const existingProduct = await CheckoutCollection.findOne({ productId: productId });

		if (existingProduct) {
			// Product exists, increment the qty
			const result = await CheckoutCollection.findOneAndUpdate(
				{ productId: productId },
				{ $inc: { qty: 1, sellingPrice: checkoutData?.sellingPrice } },
				{ new: true },
			);

			res.send(result);
		} else {
			// Product doesn't exist, save the new product data
			const newProduct = new CheckoutCollection({
				...checkoutData,
				qty: 1,
			});

			const savedProduct = await newProduct.save();
			res.send(savedProduct);
		}
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { saveCheckout, getCheckoutData };
