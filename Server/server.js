// set node environment variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// load dependencies
var mongoose = require('./config/mongoose');
var express = require('./config/express');

// create a new Mongoose connection instance
var db = mongoose();

// create a new Express application instance
var app = express();

// Import authentication routes
const authRoutes = require('./app/routes/auth.server.routes');

// Use authentication routes
app.use('/auth', authRoutes);

// Use the Express application instance to listen to the '3000' port
app.listen(3000);

// Log the server status to the console
module.exports = app;

console.log('Server running at http://localhost:3000/');
