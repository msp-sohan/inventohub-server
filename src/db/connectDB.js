const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
	console.log('Connectting to Database');
	const mongoURI = process.env.MONGODB_URI;

	await mongoose.connect(mongoURI, { dbName: process.env.DB_NAME });
	console.log('Server is Connected to Database');
};

module.exports = connectDB;
