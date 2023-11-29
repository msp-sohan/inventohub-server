const UsersCollection = require('../models/User');

const verifyAdmin = async (req, res, next) => {
	const email = req.user.email;
	const query = { email: email };
	const user = await UsersCollection.findOne(query);
	const isAdmin = user?.role === 'admin';
	if (!isAdmin) {
		return res.status(403).send({ message: 'Forbidden Access' });
	}
	next();
};

module.exports = verifyAdmin;
