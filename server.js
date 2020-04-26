const express = require('express');
const bcryptjs = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    version: '12.2',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: false,
        // host: '127.0.0.1',
        // user: 'luiavag',
        // password: 'luis1709',
        // database: 'facedetector'
    }
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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
app.post('/signin', signin.handleSignin(db, bcryptjs));

// /register
app.post('/register', register.handleResgister(db, bcryptjs));

// /profile
app.get('/profile/:id', profile.handleProfile(db));

// /image
app.put('/image', image.handleImage(db));

// Clarifai /imageurl
app.post('/imageurl', image.handleApiCall());

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