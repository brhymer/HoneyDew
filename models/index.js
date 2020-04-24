const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/honeydew-core';
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useModifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(connectionString, configOptions)
.then(() => {
    console.log('You have successfully connected to MongoDB...');
}).catch((err) {
    console.log(err);
}};

module.exports = {
    User: require('./User'),
    Space: require('./Space'),
    Task: require('./Task')
}