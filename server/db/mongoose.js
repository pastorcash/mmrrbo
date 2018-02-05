const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
// mongoose.connect(process.env.MONGODB_URI); // Mongoose version 5 requirement

module.exports = { mongoose };
