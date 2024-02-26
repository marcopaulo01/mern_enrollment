//load the student controller
var students = require('../../app/controllers/student.server.controller');
var express = require('express');
var router = express.Router();

// Define the routes module' method
module.exports = function(app) {
    // Mount the 'student' controller's 'render' method
    app.route('/students')
        .get(students.list)
        .post(students.create);
    app.route('/students/:studentId')
        .get(students.read)
        .put(students.update)
        .delete(students.delete);
    // Set up the 'studentId' parameter middleware
    app.param('studentId', students.studentByID);
};