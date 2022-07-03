const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const Contenedor = require('./src/controllers/contenedorMsg.js')
const Container = require('./src/controllers/contenedorProd.js')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const usersList = require('./src/controllers/contenedorUsers')

const session = require('express-session')
const connectMongo = require('connect-mongo')
const cookieParser = require('cookie-parser')

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }

const MongoStorage = connectMongo.create({
    mongoUrl: 'mongodb+srv://tobyceballos:coderhouse@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority',
    mongoOptions: advancedOptions,
    ttl: 600
})


app.use(express.static('./src/public'))
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(
    session({
        store: MongoStorage,
        secret: 'shhhhhhhhhhhhhh',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 10
        },
    }));
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use((req, res, next) => {
    req.isAuthenticated = () => {
        if (req.session.email) {
            return true
        }
        return false
    }
    req.logout = done => {
        req.session.destroy(done)
    }
    next()
})

//---------------------------------------------------//
// Verificar Autenticacion
//---------------------------------------------------//

app.use((req, res, next) => {
    req.isAuthenticated = () => {
        if (req.session.email) {
            return true
        }
        return false
    }
    req.logout = done => {
        req.session.destroy(done)
    }
    next()
})

//---------------------------------------------------//
// RUTAS REGISTRO
//---------------------------------------------------//

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { user, email, password } = req.body
    req.session.name = user

    console.log(email)
    const usuarios = await usersList.getUsers()
    const usuario = usuarios.find(usuario => usuario.email == email)
    if (usuario) {
        return res.render('register-error')
    }

    await usersList.saveUser({ user, email, password })
    res.redirect('/login')
})

//---------------------------------------------------//
// RUTAS LOGIN
//---------------------------------------------------//

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/datos')
    }
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    req.session.email = email
    
    const usuarios = await usersList.getUsers()
    const usuario = usuarios.find(
        usuario => usuario.email == email && usuario.password == password
    )
    if (!usuario) {
        console.log(usuarios)
        return res.render('login-error')
    }
    req.session.user = usuario.user
    res.redirect('/datos')
})

//---------------------------------------------------//
// RUTAS DATOS
//---------------------------------------------------//

async function requireAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

async function includeUserData(req, res, next) {
    if (req.session.email) {
        const usuarios = await usersList.getUsers()
        req.user = usuarios.find(usuario => usuario.email == req.session.email)
    }
    next()
}

app.get('/datos', requireAuthentication, includeUserData, async (req, res) => {
    const user = req.session.user
    console.log(user)
    const email = req.session.email
    const datos = { user, email }
    res.render('index', {datos})
})

//---------------------------------------------------//
// RUTAS LOGOUT
//---------------------------------------------------//

app.get('/logout', (req, res) => {
    req.logout(err => {
        res.redirect('/login')
    })
})

//---------------------------------------------------//
// RUTA INICIO
//---------------------------------------------------//

app.get('/', (req, res) => {
    res.redirect('/datos')
})

app.get('/delete/:id', async (req, res) => {
    const idDelete = req.params.id
    const deleteId = await Container.deleteById(idDelete)
    res.redirect('/datos')
})


io.on('connection', async (sockets) => {
    sockets.emit('product', await Container.getProds())
    console.log('Un cliente se ha conectado!: ' + sockets.id)
    // div
    sockets.emit('messages', await Contenedor.getMsg())

    sockets.on('new-product', async data => {
        const name = data.name
        const description = data.description
        const price = data.price
        const stock = data.stock
        const thumbnail = data.thumbnail
        await Container.saveProd({name, description, price, stock, thumbnail})
        
        
        io.sockets.emit('product', await Container.getProds())
    })
    sockets.on('new-message', async dato => {
        console.log(dato)
        const email = dato.email
        const text = dato.text
        const fecha = dato.fecha
        const hora = dato.hora

        await Contenedor.saveMsj(email, text, fecha, hora)

        io.sockets.emit('messages', await Contenedor.getMsg())
    })
})





const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))