const CheckoutCollection = require('../models/checkout');

const getCheckoutData = async (req, res) => {
	const email = req?.params?.email;
	console.log(email);
	const result = await CheckoutCollection.find({ userEmail: email });
	res.send(result);
};

const saveCheckout = async (req, res) => {
	const checkoutData = req.body;

	const data = new CheckoutCollection({
		...checkoutData,
	});

	try {
		const result = await data.save();
		res.send(result);
	} catch (error) {
		console.error('Error saving checkout data:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { saveCheckout, getCheckoutData };
