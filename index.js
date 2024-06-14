const express = require('express');
const connectDB = require('./src/db/connectDB');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// middleware
const corsOptions = {
	origin: ['http://localhost:5173', 'https://inventohub.netlify.app'],
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// All Routes
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const productRoutes = require('./src/routes/productRoutes');
const checkoutRoutes = require('./src/routes/checkoutRoutes');
const salesRoutes = require('./src/routes/salesRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const allSalesRoutes = require('./src/routes/allSaleRouts');

// Use All Routes
app.use('/', authRoutes);
app.use('/', shopRoutes);
app.use('/', productRoutes);
app.use('/', checkoutRoutes);
app.use('/', salesRoutes);
app.use('/', paymentRoutes);
app.use('/', allSalesRoutes);

// Check the Server Up or Down
app.get('/', (req, res) => {
	res.send('InventoHub Server is Running....');
});

// handling all unneccessery routes
app.all('*', (req, res, next) => {
	const error = new Error(`Can't find ${req.originalUrl} on the server`);
	error.status = 404;
	next(error);
});

// error handling middleware
app.use((err, _req, res, _next) => {
	res.status(err.status || 500).json({
		message: err.message,
		errors: err.errors,
	});
});

const main = async () => {
	await connectDB();
	app.listen(port, () => {
		console.log(`InventoHub Server is running on port ${port}`);
	});
};

main();
