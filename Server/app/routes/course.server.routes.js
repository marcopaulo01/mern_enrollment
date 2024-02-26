//course server routes
// Load the module dependencies
const courses = require('../../app/controllers/course.server.controller');
const express = require('express');

// Define the routes module' method
module.exports = function(app) {
    // Mount the 'course' controller's 'render' method
    app.route('/courses')
        .get(courses.list)
        .post(courses.create);
    app.route('/courses/:courseId')
        .get(courses.read)
        .put(courses.update)
        .delete(courses.delete);
    // Set up the 'courseId' parameter middleware
    app.param('courseId', courses.courseByID);
};