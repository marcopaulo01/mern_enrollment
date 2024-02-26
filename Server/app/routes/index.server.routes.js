//index serever routes

// Load the 'index' controller
var index = require('../../app/controllers/index.server.controller');

// Define the routes module' method
module.exports = function(app) {
    // Mount the 'index' controller's 'render' method
    app.get('/', index.render);
};