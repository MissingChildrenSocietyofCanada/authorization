// config/database.js
module.exports = {
  'url': process.env.MONGO_DB || "mongodb://localhost:27017"
};