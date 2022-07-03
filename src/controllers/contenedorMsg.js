const mongoose = require('mongoose');

const models = require('../models/schemaMsg');

const moment = require('moment');

mongoose.connect('mongodb+srv://tobyceballos:coderhouse@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority')



class Contenedor {
    constructor(){
        this.collection = models;
    }

    async saveMsj(email, mensaje, fecha, hora){

        const newMsg = {
            email: email,
            text: mensaje,
            fecha: fecha,
            hora: hora
        }

        const saves = await this.collection.insertMany(newMsg)
        return saves
    };

    async getMsg(){
        const gets = await this.collection.find()
        return gets
    }
};


const message = new Contenedor()
module.exports = message;




//const knex = require('knex');
//const connect = require('../connect/connect2')
//
//class Contenedor {
//    constructor(archivo){
//        this.knex = knex(archivo);
//    }
//
//    async crearTablaMsg() {
//        return this.knex.schema.dropTableIfExists('mensajes')
//            .finally(() => {
//                return this.knex.schema.createTable('mensajes', table => {
//                    table.varchar('author', 50).notNullable()
//                    table.varchar('message', 2500).notNullable()
//                    table.varchar('fecha', 30).notNullable()
//                    table.varchar('hora', 30).notNullable()
//                })
//            })
//    }
//
//    async saveMsj(msg){
//        return this.knex('mensajes').insert(msg)
//    };
//
//    async getMsg(){
//        return this.knex('mensajes').select('*')
//    }
//};
//
//
//const message = new Contenedor(connect)
//module.exports = message;
