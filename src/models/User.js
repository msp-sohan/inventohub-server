const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
