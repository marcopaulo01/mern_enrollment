//load the module dependencies
var mongoose = require('mongoose')

//Define a schema
const Schema = mongoose.Schema;

//Define a new 'CourseSchema'
var CourseSchema = new Schema({
    courseCode: Number,
    courseName: String,
    section: Number,
    semester: String,
    students: [{type: Schema.Types.ObjectId, ref: 'Student'}]
});

//Create the 'Course' model out of the 'CourseSchema'
mongoose.model('Course', CourseSchema);