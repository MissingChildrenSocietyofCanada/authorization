// config/database.js
module.exports = {
	'url': process.env.MONGO_DB || 'mongodb://localhost:27017/',
	'authKey': process.env.MONGO_DB_AUTH_KEY,
	'name': process.env.MONGO_DB_NAME
};