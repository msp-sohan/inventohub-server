const User = require('../models/User');
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
	} catch (err) {
		res.status(500).send(err);
	}
};

//  Get All User Data
const getUser = async (req, res) => {
	const result = await User.find();
	res.send(result);
};

// Save User Data in Database
const saveUser = async (req, res) => {
	const email = req.params.email;
	const user = req.body;
	const query = { email: email };
	const options = { upsert: true };
	const isExist = await User.findOne(query);
	if (isExist) {
		if (user?.status === 'Requested') {
			const result = await User.updateOne(
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
	const result = await User.updateOne(
		query,
		{
			$set: { ...user, timestamp: new Date() },
		},
		options,
	);
	res.send(result);
};

// Get user Role
const getRole = async (req, res) => {
	const email = req.params.email;
	const result = await User.findOne({ email: email });
	res.send(result);
};

module.exports = { createToken, clearCookie, getUser, saveUser, getRole };
