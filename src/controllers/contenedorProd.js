const mongoose = require('mongoose');

const models = require('../models/schemaProd.js');

const moment = require('moment');

mongoose.connect('mongodb+srv://tobyceballos:coderhouse@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority')


class Contenedor {
    constructor() {
        this.coleccion = models
    }

    async updateById(productId, {name, description, price, stock, thumbnail}) {
        try {
            const update = await this.coleccion.findOneAndUpdate({ id: productId },{name: name, description: description, price: price, stock: stock, thumbnail: thumbnail});
            return update;
        }
        catch (err) {
            console.log('ERROR ->', err);
        }
    }


    async saveProd({name, description, price, stock, thumbnail}) {
        try {
            const objs = await this.getProds();
            let newId = 1;
            if (objs.length > 0) {
                newId = objs[objs.length - 1].id + 1;
            }
            console.log(newId)
            const newObj = {
                id: newId,
                name: name,
                description:description,
                price: price,
                stock: stock,
                thumbnail: thumbnail,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            const add = await this.coleccion.insertMany(newObj)
            return add;
        } catch (error) {
            console.log('ERROR => ', error);
        }
    };

    async deleteById(idProducto) {
        try {
            const deleteById = this.coleccion.findOneAndDelete({id: idProducto})
            return deleteById;
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }

    async getProdById(idProducto) {
        try {
            const obj = await this.coleccion.find({id: idProducto})
            return obj
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }

    async getProds() {
        try {
            const objs = await this.coleccion.find()
            console.log(objs)
            return objs;
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }
};

const prod = new Contenedor();

module.exports = prod;

//const knex = require('knex');
//const { options } = require('../connect/connect')
//
//class Contenedor {
//    constructor(options) {
//        this.knex = knex(options);
//    }
//
//    async crearTabla() {
//        return this.knex.schema.dropTableIfExists('customer')
//            .finally(() => {
//                return this.knex.schema.createTable('customer', table => {
//                    table.increments('id').primary()
//                    table.varchar('name', 64).notNullable()
//                    table.float('price', 10.2).notNullable()
//                    table.varchar('description', 100).notNullable()
//                    table.integer('stock', 64).notNullable()
//                    table.varchar('thumbnail', 3000).notNullable()
//                })
//            })
//    }
//
//
//    async saveProd(articulos) {
//        return this.knex('customer').insert(articulos)
//    }
//
//
//    async getProds() {
//        return this.knex('customer').select('*')
//    }
//};
//
//
//
//const archivo1 = new Contenedor(options)
//module.exports = archivo1;








//const { promises: fs } = require('fs')
//
//class Contenedor {
//    constructor(archivo) {
//        this.archivo = archivo;
//    }
//
//    async saveProd(obj) {
//        try {
//            const objs = await this.getProds();
//            //console.log(objs)
//            let newId = 1;
//            if (objs.length > 0) {
//                newId = objs[objs.length - 1].id + 1;
//            }
//            const newObj = { ...obj, id: newId }
//            objs.push(newObj)
//
//            fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))
//            console.log(`Creado exitosamente el producto ${newId}`);
//
//        } catch (error) {
//            console.log('Error al crear', error);
//        }
//    };
//
//    async getProds() {
//        try {
//            const objs = await fs.readFile(this.archivo, 'utf-8');
//            return JSON.parse(objs);
//        } catch (error) {
//            return error;
//        }
//    }
//};
//
//
//
//const archivo1 = new Contenedor("./productos.txt")
//module.exports = archivo1;
