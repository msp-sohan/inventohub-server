const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({}, { strict: false });

const UsersCollection = mongoose.model('User', userSchema);

module.exports = UsersCollection;
