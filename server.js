import express from 'express';
// import bcrypt from 'bcrypt-nodejs';
import bcryptjs from 'bcryptjs';
import cors from 'cors';
// import path from 'path';
import knex from 'knex';
import handleResgister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfile from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

const db = knex({
    client: 'pg',
    version: '12.2',
    connection: {
        host: '127.0.0.1',
        user: 'luiavag',
        password: 'luis1709',
        database: 'facedetector'
    }
});

// Test DB connection
// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();
const port = 3001;

// express middleware
// app.use((req, res, next) => {
//     console.log('test test')
//     next()
// });
// app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'Luis',
//             email: 'luiavag@gmail.com',
//             password: '1234',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Vicky',
//             email: 'vicky@email.com',
//             password: 'bananas123',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
//     // ,
//     // login: [
//     //     {
//     //         id: '789',
//     //         hash: '',
//     //         email: 'luis@email.com'
//     //     },
//     //     {
//     //         id: '584',
//     //         hash: '',
//     //         email: 'vicky@email.com'
//     //     }
//     // ]
// }

// root
app.get('/', (req, res) => { res.send(database.users) });

// /signin
app.post('/signin', handleSignin(db, bcryptjs));

// /register
app.post('/register', handleResgister(db, bcryptjs));

// /profile
app.get('/profile/:id', handleProfile(db));

// /image
app.put('/image', handleImage(db));

// Clarifai /imageurl
app.post('/imageurl', handleApiCall());

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