//load dependencies
const Student = require('mongoose').model('Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

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
                message = 'Student already exists';
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

//create a new student controller method
exports.create = function(req, res, next) {
    // Create a new instance of the 'Student' Mongoose model
    var student = new Student(req.body);

    // Try saving the new student document
    student.save()
        .then(savedStudent => {
            // Use the 'response' object to send a JSON response
            res.status(200).json(savedStudent);
        })
        .catch(err => {
            // Call the next middleware with an error message
            return next(err);
        });
};

//return all students
exports.list = function(req, res, next) {
    // Use the 'Student' instance's 'find' method to retrieve a new student document
    Student.find({})
    .then(students => {
        res.status(200).json(students);
    })
    .catch(err => {
        return next(err);
    });
};

//read controller method to display a student
exports.read = function(req, res) {
    // Use the 'response' object to send a JSON response
    res.status(200).json(req.student);
};

//studentByID controller method to find a student by its id
exports.studentByID = function(req, res, next, id) {
    // Use the 'findById' method on the Student model to find the student by ID
    Student.findById(id)
        .exec() // Remove the callback function
        .then(student => {
            if (!student) {
                // If student is not found, create a new error and pass it to the next middleware
                return next(new Error('Failed to load student ' + id));
            }
            // If student is found, attach it to the request object and proceed to the next middleware
            req.student = student;
            next();
        })
        .catch(err => {
            // Forward the error to the error-handling middleware
            return next(err);
        });
};

//update a student by id
exports.update = function(req, res, next) {
    // Use the 'Student' static 'findByIdAndUpdate' method to update a specific student by their studentId
    Student.findByIdAndUpdate(req.student.id, req.body, {
        new: true
    }, (err, student) => {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.status(200).json(student);
        }
    });
}

//delete a student by id
exports.delete = function(req, res, next) {
    // Use the 'Student' instance's 'remove' method to save a new student document
    req.student.remove()
    .then(student => {
        res.status(200).json(student);
    })
    .catch(err => {
        return next(err);
    });
}


//authenticate a student
exports.authenticate = function(req, res, next) {
    // Get the student details from the request body
    const { studentNumber, password } = req.body;

    //find the student with the given student number using static method findOne
    Student.findOne({ studentNumber })
        .then(student => {
            if(!student) {
                // If the student is not found, return a response with a 401 status code
                return res.status(401).send('Student Not Found');
            }

            // Use the 'comparePassword' instance method to compare the passed password with the student's hashed password
            if(bcrypt.compareSync(password, student.password)) {
                // Create a new token with the student id in the payload
                const token = jwt.sign({ id: student.id, studentNumber: student.studentNumber }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });
                // Set the token in a cookie
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
                // The student is authenticated
                res.status(200).json({ success: true, studentId: student._id });
            }else {
                // If the password is incorrect, return a response with a 401 status code
                res.status(401).send('Incorrect password');
            }
        })
        .catch(err => {
            return next(err);
        });
};

//protected route
exports.requiresLogin = function(req, res, next) {
    //get the token from the request
    const token = req.cookies.token;
    //if the token is not found, return unauthorized
    if (!token) {
        return res.status(401).end();
    }
    //verify the token
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            return res.status(401).end();
        }
        next();
    });
}

//protected route
exports.Welcone = function(req, res, next) {
    //get the token from the request
    const token = req.cookies.token;
    //if the token is not found, return unauthorized
    if (!token) {
        return res.status(401).end();
    }
    //verify the token
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            return res.status(401).end();
        }
        next();
    });
}

//deletes the token
exports.logout = function(req, res, next) {
    res.clearCookie('token');
    res.status(200).send('Logged out');
}

//check if the student is logged in
exports.isLoggedIn = function(req, res, next) {
    //get the token from the request
    const token = req.cookies.token;
    //if the token is not found, return unauthorized
    if (!token) {
        return res.status(401).end();
    }
    //verify the token
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            return res.status(401).end();
        }
        next();
    });
}

//isAuthorized middleware
exports.isAuthorized = function(req, res, next) {
    //get the token from the request
    const token = req.cookies.token;
    //if the token is not found, return unauthorized
    if (!token) {
        return res.status(401).end();
    }
    //verify the token
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            return res.status(401).end();
        }
        //check if the student is authorized
        if (req.student.id !== payload.id) {
            return res.status(403).end();
        }
        next();
    });
}