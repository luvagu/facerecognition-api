const express = require('express');
const bcryptjs = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/auth');

// heruko fix for ssl error on free account
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // comment on testing: HEROKU SETTINGS

const db = knex({
    client: 'pg',
    version: '12.2',
    connection: {
        connectionString: process.env.DATABASE_URL, // comment on testing: HEROKU SETTINGS
        ssl: true, // comment on testing: HEROKU SETTINGS
    //     host: process.env.POSTGRES_HOST, // comment on production '127.0.0.1'
    //     user: process.env.POSTGRES_USER, // comment on production 'luiavag'
    //     password: process.env.POSTGRES_PASSWORD, // comment on production 'luis1709'
    //     database: process.env.POSTGRES_DB // comment on production 'facedetector'
    }
    // connection: process.env.POSTGRES_URI // comment on production: DOCKER SETTINGS
});

const app = express();
const port = process.env.PORT || 3000;

// IP/Site whitelist implementation
// const whitelist = ['http://localhost:3001'];
// const corsOptions = {
// 	origin: function (origin, callback) {
// 		if (whitelist.indexOf(origin) !== -1) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// };

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// root
app.get('/', (req, res) => {
    res.status(200).json({
        "hello": "Welcome to Node.js & Express Server by LuVaGu",
        "purpose": "Server and Database for my Face Recognition React App",
        "appUrl": "https://luiavag.github.io/facerecognition/",
        "serverPort": `Server is running on port ${port}`,
        "serverMessage": "Now accepting requests..."
    })
});

// /signin
app.post('/signin', signin.signinAuth(db, bcryptjs));

// /register
app.post('/register', register.handleResgister(db, bcryptjs));

// /profile
app.get('/profile/:id', auth.requireAuth(), profile.handleProfileGet(db));
app.post('/profile/:id', auth.requireAuth(), profile.handleProfileUpdate(db));

// /image
app.put('/image', auth.requireAuth(), image.handleImage(db));

// Clarifai /imageurl
app.post('/imageurl', auth.requireAuth(), image.handleApiCall());

// server port
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
});

// End points structure for this API
// --> res = This is working
// /signin --> POST = success/fail
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT => user