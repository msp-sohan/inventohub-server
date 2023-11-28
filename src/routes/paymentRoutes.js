const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);

// create payment info
router.post('/create-payment-intent', async (req, res) => {
	const { price } = req.body;
	const amount = parseInt(price * 100);
	if (!price || amount < 1) return;
	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount,
		currency: 'usd',
		payment_method_types: ['card'],
	});
	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

module.exports = router;
