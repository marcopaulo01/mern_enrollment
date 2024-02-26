//load dependencies
var config = require('./config');
const mongoose = require('mongoose');

//Define the Mongoose configuration method
module.exports = function() {
    //Use Mongoose to connect to MongoDB
    var db = mongoose.connect(config.db)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

    //Load the 'Student' model
    require('../app/models/student.server.model');

    //Load the 'Course' model
    require('../app/models/course.server.model');

    //Return the Mongoose connection instance
    return db;
};