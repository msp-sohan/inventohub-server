const UsersCollection = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = async (req, res) => {
	const user = req.body;
	const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '365d',
	});
	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
	}).send({ success: true });
};

// Clear Cookie
const clearCookie = async (req, res) => {
	try {
		res.clearCookie('token', {
			maxAge: 0,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
		}).send({ success: true });
	} catch (error) {
		res.status(500).send(error);
	}
};

// Get user Role
const getRole = async (req, res) => {
	const email = req.params.email;
	const result = await UsersCollection.findOne({ email: email });
	res.send(result);
};

//  Get All User Data
const getUser = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 0;
		const limit = parseInt(req.query.limit) || 10;

		const result = await UsersCollection.find()
			.skip(page * limit)
			.limit(limit)
			.exec();

		const count = await UsersCollection.countDocuments();
		res.status(200).json({ result, count });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

// Save User Data in Database
const saveUser = async (req, res) => {
	const email = req.params.email;
	const user = req.body;
	const query = { email: email };
	const options = { upsert: true };
	const isExist = await UsersCollection.findOne(query);
	if (isExist) {
		if (user?.status === 'Requested') {
			const result = await UsersCollection.updateOne(
				query,
				{
					$set: user,
				},
				options,
			);
			return res.send(result);
		} else {
			return res.send(isExist);
		}
	}
	const result = await UsersCollection.updateOne(
		query,
		{
			$set: { ...user, timestamp: new Date() },
		},
		options,
	);
	res.send(result);
};

module.exports = { createToken, clearCookie, getUser, saveUser, getRole };
