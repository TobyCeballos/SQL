const mongoose = require('mongoose');

const prodCollection = 'users';

const prodSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

const productos = mongoose.model(prodCollection, prodSchema);

module.exports = productos;