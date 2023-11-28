const ProductCollection = require('../models/Product');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');

// Get All Product count
const getProduct = async (req, res) => {
	const result = await ProductCollection.find();
	res.send(result);
};
// Get All Product by useremail
const getAllProduct = async (req, res) => {
	const email = req?.params?.email;
	const result = await ProductCollection.find({ userEmail: email });
	res.send(result);
};

// Save Droduct to database
const saveProduct = async (req, res) => {
	try {
		const productData = req.body;

		// Find the shop
		const shopInfo = await Shop.findOne({ shopOwnerEmail: productData?.userEmail });
		const productInfo = await ProductCollection.find({ userEmail: productData?.userEmail });

		if (!shopInfo) {
			return res.status(404).send({ error: 'Shop not found' });
		}

		// Check if the shop has reached its product limit
		if (productInfo?.length >= shopInfo.limit) {
			return res.status(400).send({ error: 'Product limit reached for this shop' });
		}

		// Calculate Selling Price
		const taxPercentage = 7.5;
		const profitPercentage = productData?.profitMargin;
		const sellingPrice =
			productData.productionCost +
			(productData.productionCost * taxPercentage) / 100 +
			(productData.productionCost * profitPercentage) / 100;

		// Create a new product
		const newProduct = new ProductCollection({
			...productData,
			shopId: shopInfo._id,
			shopName: shopInfo.shopName,
			sellingPrice,
			productAddedDate: new Date(),
			saleCount: 0,
		});

		// Save the product to the database
		const savedProduct = await newProduct.save();
		console.log(savedProduct);

		res.status(200).send(savedProduct);
	} catch (error) {
		console.error('Error saving product:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Update a Product in the database
const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const objectId = new mongoose.Types.ObjectId(productId);

		const updatedProductData = req.body;

		// Update the product data
		const updatedProduct = await ProductCollection.findOneAndUpdate(
			{ _id: objectId },
			{
				$set: {
					productName: updatedProductData?.productName,
					productQuantity: updatedProductData?.productQuantity,
					productLocation: updatedProductData?.productLocation,
					productionCost: updatedProductData?.productionCost,
					profitMargin: updatedProductData?.profitMargin,
					discount: updatedProductData?.discount,
					productDescription: updatedProductData?.productDescription,
					productImage: updatedProductData?.productImage,
				},
			},
			{ new: true },
		);
		console.log(updatedProduct);

		res.status(200).send(updatedProduct);
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Delete a Product
const deleteProduct = async (req, res) => {
	const productId = req.params.id;
	const query = { _id: new mongoose.Types.ObjectId(productId) };
	const deletedProduct = await ProductCollection.findByIdAndDelete(query);
	res.send(deletedProduct);
};

module.exports = { getProduct, saveProduct, getAllProduct, updateProduct, deleteProduct };
