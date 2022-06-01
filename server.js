const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const Contenedor = require('./src/controllers/contenedorMsg.js')
const Container = require('./src/controllers/contenedorProd.js')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('./src/public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('index.ejs', {root: __dirname})
})





io.on('connection', async (sockets) => {
    const product = await Container.getProds()
    sockets.emit('product', await Container.getProds())
    console.log('Un cliente se ha conectado!: ' + sockets.id)
    // div
    sockets.emit('messages', await Contenedor.getMsg())

    sockets.on('new-product', async data => {
        await Container.saveProd(data)
        console.log(data)
        
        io.sockets.emit('product', await Container.getProds())
    })
    sockets.on('new-message', async dato => {

        await Contenedor.saveMsj(dato)
        console.log(dato)

        io.sockets.emit('messages', await Contenedor.getMsg())
    })
})





const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))