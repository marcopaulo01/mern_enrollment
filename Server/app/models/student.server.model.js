//Load dependencies
const mongoose = require('mongoose');
const bycrypt = require('bcrypt-nodejs');
const saltRounds = 10;
//Define the schema
const Schema = mongoose.Schema;

//Define the student schema
var StudentSchema = new Schema({
    studentNumber: { type: String, unique: true },
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: String,
    city: String,
    phone: String,
    program: String,
    volunteer: String,
    language: String
});

// Set 'fullname' virtual property
StudentSchema.virtual('fullName').get(function(){
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName){
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
StudentSchema.pre('save', function(next){
    if(this.password){
        this.password = this.hashPassword(this.password);
    }
    next();
});

// Create an instance method for hashing a password
StudentSchema.methods.hashPassword = function(password){
    return bycrypt.hashSync(password, bycrypt.genSaltSync(saltRounds));
};

// Create an instance method for authenticating student
StudentSchema.methods.authenticate = function(password){
    return bycrypt.compareSync(password, this.password);
};

// Configure the 'StudentSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Student' model out of the 'StudentSchema'
mongoose.model('Student', StudentSchema);