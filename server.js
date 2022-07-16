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
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const MongoStorage = connectMongo.create({
    mongoUrl: 'mongodb+srv://tobyceballos:coderhouse@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority',
    mongoOptions: advancedOptions,
    ttl: 600
})

app.use(
    session({
        store: MongoStorage,
        secret: 'shhhhhhhhhhhhhh',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 10
        },
    })
);

//---------------------------------------------------//
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
//---------------------------------------------------//



passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const usuario = await usersList.getUser(email)
    console.log(usuario)
    if (usuario) {
        return done('The Email is already Taken.');
    } else {
        const user = req.body.user
        const saved = await usersList.saveUser({ user, email, password });
        done(null, saved);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await usersList.getUser({ email: email });
    if (!user) {
        return done('404 => Not found user.');
    }
    if (!user.comparePassword(password)) {
        return done('Incorrect password.');
    }
    return done(null, user);
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
}


app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/login' }))

app.get('/failregister', (req, res) => {
    res.render('register-error')
})

//---------------------------------------------------//
// RUTAS LOGIN

app.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    res.render('login')
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/datos' }))

app.get('/faillogin', (req, res) => {
    res.render('login-error')
})

//---------------------------------------------------//
// RUTAS DATOS

app.get('/datos', isAuth, (req, res) => {
    const user = req.session.user
    console.log(user)
    const email = req.session.email
    const datos = { user, email }
    res.render('index', {datos})
})

//---------------------------------------------------//
// RUTAS LOGOUT

app.get('/logout', (req, res) => {
    req.logout(err => {
        res.redirect('/login')
    })
})

//---------------------------------------------------//
// RUTAS INICIO

app.get('/', isAuth, (req, res) => {
    res.redirect('/datos')
})

//---------------------------------------------------//




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
        await Container.saveProd({ name, description, price, stock, thumbnail })


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