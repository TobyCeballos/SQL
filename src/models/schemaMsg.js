const mongoose = require('mongoose');

const prodCollection = 'mensajes';

const prodSchema = new mongoose.Schema({
    email: {type: String, required: true},
    text : {type: String, required: true},
    fecha: { type: String, required: true},
    hora: {type: String, required:true}
})

const productos = mongoose.model(prodCollection, prodSchema);

module.exports = productos;