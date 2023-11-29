const UsersCollection = require('../models/User');

const verifyManager = async (req, res, next) => {
	const email = req.user.email;
	const query = { email: email };
	const user = await UsersCollection.findOne(query);
	const isManager = user?.role === 'manager';
	if (!isManager) {
		return res.status(403).send({ message: 'Forbidden Access' });
	}
	next();
};

module.exports = verifyManager;
