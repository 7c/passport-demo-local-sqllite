const chalk = require('chalk')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const server = http.createServer(app)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const middleware_client = require('./middleware_client')
const middleware_logging = require('./middleware_logging')

// session storage sqllite3
// const connect = require('connect'),SQLiteStore = require('connect-sqlite3')(connect);
const SQLiteStore = require('connect-sqlite3');
const Store = new SQLiteStore(session)

// connect.createServer(
//     connect.cookieParser(),
//     connect.session({ store: new SQLiteStore, secret: 'your secret' })
// );

const user = { user: "John Doe", id: 555, registered: new Date().toISOString() }

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb', parameterLimit: 5000 }))
app.use(bodyParser.json({ limit: '1mb', strict: false }))

app.use(session({
    secret: 'supersecret_random_string',
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: '.mysite.com', // to allow *.mysite.com
        expires: false, // no expiration
    },
    name: 'myapp', // good to change this
    store: new Store({
        dir:"./",
        db: "sessions.sqllite",
        table: "sessions",
    }),
}));
app.use(passport.initialize())
app.use(passport.session());

passport.use("local", new LocalStrategy(
    function (username, password, done) {
        console.log(chalk.yellow(`passport.use '${username}' '${password}'`))
        return done(null, user)
        //   User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) { return done(null, false); }
        //     if (!user.verifyPassword(password)) { return done(null, false); }
        //     return done(null, user);
        //   });
    }
))

passport.serializeUser((user, done) => {
    console.log(chalk.yellow(`serialiseUser ${JSON.stringify(user)}`))
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(chalk.blue(`deserializeUser ${JSON.stringify(id)}`))
    // const user = users.find(u => u.id === id);
    done(null, user);
});

// cors settings
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


app.use(middleware_client)
app.use(middleware_logging)

app.get('/ping', (req, res) => { res.send('pong') })
app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/home');
    });
})

app.post('/login', (req, res, next) => { // post 'username','password' to /login
    console.log(`/login`)
    passport.authenticate('local', (err, user) => {
        console.log(`api_auth_login - ${err} - ${JSON.stringify(user)}`)
        req.logIn(user, function (err) {
            console.log(chalk.magenta(`req.logIn`), err)
            if (err) return next(err);
            if (!req.session.views)
                req.session.views = 0
            req.session.views++
            res.json(req.session)
        })

    })(req, res, next)
})

app.get('/profile', requireAuthentication, (req, res) => {
    res.send(`Profile of ${JSON.stringify(req.user)} - Session: ${JSON.stringify(req.session)}`)
})

app.get('/home', (req, res) => {
    res.send(`isAuthenticated: ${req.isAuthenticated()}`)
})

app.use('*', (req, res) => {
    res.send("Default")
})


function requireAuthentication(req, res, next) {
    console.log(`isAuthenticated`, req.isAuthenticated())
    if (req.isAuthenticated()) return next()
    console.log(`user`, req.user)
    // res.redirect('/login')
    res.sendStatus(403)
}

async function start() {
    try {
        const port = 4000
        server.listen(port, '127.0.0.1', async () => {
            console.log(chalk.bgYellow(`API server has been launched at the port ${port}`))
        })
    } catch (err) {
        console.log(chalk.red(err))
    }
}

start()
