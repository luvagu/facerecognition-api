const jwt = require('jsonwebtoken');

// Setup Redis:
const redis = require('redis');

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (username) => {
	const jwtPayload = { username };
	return jwt.sign(
		jwtPayload,
		'4p89WxyTGJueIqyt8iYibspFGPcBkzle4amoRJdCCCbXuXdvgPjRH6W9g2PGOHHG',
		{ expiresIn: '2 days' }
	);
}

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
	// JWT token, return user data
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => ({ success: 'true', userId: id, token }))
		.catch(console.log);
};

const checkUser = (db, bcryptjs, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('Incorrect form submition');
    }
    return db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcryptjs.compareSync(password, data[0].hash);
            // console.log('isValid', isValid);
            // console.log('user', login[0]);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => user[0])      
                    .catch(err => Promise.reject('Unable to get user'))
            } else {
                return Promise.reject('Wrong credentials!')
            }
        })
        .catch(err => err);
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).send('Unauthorized');
        }
        return res.json({id: reply})        
    })
}

const signinAuth = (db, bcryptjs) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res)
        : checkUser(db, bcryptjs, req, res)
        .then(data => {
            return data.id && data.email ? createSession(data) : Promise.reject(data)
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err))
}

module.exports = {
    signinAuth: signinAuth,
    redisClient: redisClient
}