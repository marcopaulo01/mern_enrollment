//course server comtroller
// Load the module dependencies
const mongoose = require('mongoose');
const Course = mongoose.model('Course');

// Create a new error handling controller method
const getErrorMessage = function(err) {
    // Define the error message variable
    var message = '';

    // If an internal MongoDB error occurs get the error message
    if (err.code) {
        switch (err.code) {
            // If a unique index error occurs set the message error
            case 11000:
            case 11001:
                message = 'Course already exists';
                break;
            // If a general error occurs set the message error
            default:
                message = 'Something went wrong';
        }
    } else {
        // Grab the first error message from a list of possible errors
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    // Return the message error
    return message;
};

//create a new course controller method
exports.create = function(req, res, next) {
    // Create a new instance of the 'Course' Mongoose model
    var course = new Course(req.body);

    // Try saving the new course document
    course.save((err) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.status(200).json(course);
        }
    });
};

//return all courses
exports.list = function(req, res, next) {
    // Use the 'Course' instance's 'find' method to retrieve a new course document
    Course.find({})
    .then(courses => {
        res.status(200).json(courses);
    })
    .catch(err => {
        return next(err);
    });
};

//read controller method to display a course
exports.read = function(req, res) {
    // Use the 'response' object to send a JSON response
    res.json(req.course);
};

//courseByID controller method to find a course by its id
exports.courseByID = function(req, res, next, id) {
    // Use the 'Course' static 'findOne' method to retrieve a specific course
    Course.findOne({
            _id: id
        })
        .then(course => {
            // If a course was found use the 'request' object to pass it to the next middleware
            req.course = course;
            // Call the next middleware
            next();
        })
        .catch(err => {
            // Call the next middleware with an error message
            return next(err);
        });
};

//update a course by id
exports.update = function(req, res, next) {
    // Use the 'Course' static 'findByIdAndUpdate' method to update a specific course by its id
    Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true })
        .then(course => {
            // If the course is successfully updated, send a JSON response with the updated course
            res.status(200).json(course);
        })
        .catch(err => {
            // If an error occurs, pass it to the next middleware
            next(err);
        });
}


//course delete controller method
exports.delete = function(req, res, next) {
    // Use the 'Course' instance's 'remove' method to save a new course document
    req.course.remove((err) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.status(200).json(req.course);
        }
    });
};

//create a new 'hasAuthorization' controller method
exports.hasAuthorization = function(req, res, next) {
    // If the current user is not the creator of the course send the appropriate error message
    if (req.course.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    // Call the next middleware
    next();
};
