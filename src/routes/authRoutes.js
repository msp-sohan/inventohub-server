const express = require('express');
const authController = require('../controllers/authController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Create Token
router.post('/jwt', authController.createToken);
// Logout - clear cookie
router.get('/logout', authController.clearCookie);
// Ger All User Data
router.get('/users', verifyToken, verifyAdmin, authController.getUser);
// Save User Data
router.put('/users/:email', authController.saveUser);

// Get User Role
router.get('/user/:email', authController.getRole);

module.exports = router;
