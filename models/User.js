const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum password length is 6 character']
    }
});

// Mongoose Hooks
// Function after doc saved to database
//userSchema.post('save', function (doc, next) {
//    console.log('new user was created & saved', doc)
//    next();
//});

// Function before saved to database
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static Method to Login User
userSchema.statics.login = async function(email, password) {
    // Find email on database
    const user = await this.findOne({ email });

    if (user) {
        // Comparing password
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

// param: collections
const User = new mongoose.model('users', userSchema);

// exporter
module.exports = User;