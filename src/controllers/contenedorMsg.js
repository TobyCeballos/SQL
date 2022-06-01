const knex = require('knex');
const connect = require('../connect/connect2')

class Contenedor {
    constructor(archivo){
        this.knex = knex(archivo);
    }

    async crearTablaMsg() {
        return this.knex.schema.dropTableIfExists('mensajes')
            .finally(() => {
                return this.knex.schema.createTable('mensajes', table => {
                    table.varchar('author', 50).notNullable()
                    table.varchar('message', 2500).notNullable()
                    table.varchar('fecha', 30).notNullable()
                    table.varchar('hora', 30).notNullable()
                })
            })
    }

    async saveMsj(msg){
        return this.knex('mensajes').insert(msg)
    };

    async getMsg(){
        return this.knex('mensajes').select('*')
    }
};


const message = new Contenedor(connect)
module.exports = message;
