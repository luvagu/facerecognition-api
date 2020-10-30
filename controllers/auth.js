const redisClient = require('./signin').redisClient;

const requireAuth = () => (req, res, next) => {
    const { authorization } = req.headers;
	if (!authorization) {
		console.log('Unauthorized, authorization is not set');
		return res.status(401).send('Unauthorized');
	}
	return redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			console.log('Unauthorized, err or no reply');
			return res.status(401).send('Unauthorized');
		}
		console.log('Success, pass granted');
		return next();
	});
};

module.exports = {
	requireAuth: requireAuth
};