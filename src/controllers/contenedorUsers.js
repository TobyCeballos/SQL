const mongoose = require('mongoose');

const models = require('../models/schemaUser');

const moment = require('moment');

mongoose.connect('mongodb+srv://tobyceballos:coderhouse@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority')



class Contenedor {
    constructor(){
        this.collection = models;
    }

    async saveUser({user, email, password}){

        const newUser = {
            user: user,
            email: email,
            password: password,
        }

        const saves = await this.collection.insertMany(newUser)
        return saves
    };

    async getUsers(){
        const gets = await this.collection.find()
        return gets
    }
};


const message = new Contenedor()
module.exports = message;
