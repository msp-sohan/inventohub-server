const ShopCollection = require('../models/Shop');
const User = require('../models/User');

// Get All Shops
const getAllShop = async (req, res) => {
	try {
		const result = await ShopCollection.find();
		res.send(result);
	} catch (error) {
		console.error('Error getting shops:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Save User Data in Database
const saveShop = async (req, res) => {
	const shop = req.body;
	const userEmail = shop?.shopOwnerEmail;

	// Check if the user already has a shop
	const existingUser = await User.findOne({ email: userEmail });
	if (existingUser?.shopId) {
		return res.status(400).send({ message: 'User already has a Shop' });
	}

	const shopData = new ShopCollection({
		...shop,
		limit: 3,
	});

	// Save the shop to the database
	const result = await shopData.save();
	console.log(result._id);

	// Update the user information
	const updatedUser = await User.findOneAndUpdate(
		{ email: userEmail },
		{
			$set: {
				role: 'manager',
				shopId: result?._id,
				shopName: shop.shopName,
				shopLogo: shop.shopLogo,
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
		const adminUser = await User.findOne({ role: 'admin' });
		if (!adminUser) {
			return res.status(404).json({ error: 'Admin user not found' });
		}
		const hasIncome = adminUser.income !== undefined;
		// Increment the income property
		const updatedAdminUser = await User.findOneAndUpdate(
			{ role: 'admin' },
			{
				$inc: {
					income: hasIncome ? limitData?.price : 0,
				},
				$setOnInsert: {
					income: hasIncome ? undefined : limitData?.price,
				},
			},
			{ upsert: true, new: true },
		);

		if (!updatedAdminUser) {
			return res.status(404).json({ error: 'Admin user not found' });
		}

		// update limit
		const updatedShop = await ShopCollection.findOneAndUpdate(
			{ shopOwnerEmail: email },
			{
				$inc: {
					limit: limitData?.limit,
				},
			},
			{ new: true },
		);

		if (!updatedShop) {
			return res.status(404).send({ error: 'Shop not found' });
		}

		res.status(200).send(updatedShop);
	} catch (error) {
		console.error('Error updating shop limit:', error);
		res.status(500).send({ error: 'Server error' });
	}
};

module.exports = { getAllShop, saveShop, updateLimit };
