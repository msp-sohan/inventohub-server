const ShopCollection = require('../models/Shop');
const UsersCollection = require('../models/User');

// Get All Shops
const getAllShop = async (req, res) => {
	const email = req.query.email;

	try {
		let query = {};

		if (email) {
			query = { email: email };
		}

		const result = await ShopCollection.find(query);
		res.send(result);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

// Save Shop Data in Database
const saveShop = async (req, res) => {
	const shopData = req.body;
	const email = shopData?.email;

	// Check if the user already has a shop
	const existingUser = await UsersCollection.findOne({ email });
	if (existingUser?.shopId) {
		return res.status(400).send({ message: 'User already has a Shop' });
	}

	const saveShopData = new ShopCollection({
		...shopData,
		limit: 3,
	});

	// Save the shop data to the database
	const result = await saveShopData.save();

	// Update the user information
	await UsersCollection.findOneAndUpdate(
		{ email },
		{
			$set: {
				role: 'manager',
				shopId: result?._id,
				shopName: shopData.shopName,
				shopLogo: shopData.shopLogo,
			},
		},
		{ new: true },
	);

	res.send(result);
};

// Update product Llimit of shop owner
const updateLimit = async (req, res) => {
	const email = req.params.email;
	const limitData = req.body;

	try {
		// Increment the income property
		const updatedAdminUser = await UsersCollection.findOneAndUpdate(
			{ role: 'admin' },
			{ $inc: { income: limitData?.price } },
			{ upsert: true, new: true },
		);

		if (!updatedAdminUser) {
			return res.status(404).json({ error: 'Admin user not found' });
		}

		// Set income if it doesn't exist
		if (updatedAdminUser.income === undefined) {
			updatedAdminUser.income = limitData?.price;
		}

		// Save the  with the new income value
		await updatedAdminUser.save();

		// Update limit
		const updatedShop = await ShopCollection.findOneAndUpdate(
			{ email: email },
			{ $inc: { limit: limitData?.limit } },
			{ new: true },
		);

		if (!updatedShop) {
			return res.status(404).send({ error: 'Shop not found' });
		}

		res.status(200).send(updatedShop);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
};

module.exports = { getAllShop, saveShop, updateLimit };
