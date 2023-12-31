// Import Model
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Error Handling
const errorHandling = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // Incorrect Email Login
    if (err.message === 'Incorrect Email') {
        errors.email = 'Email not registered';
    }

    if (err.message === 'Incorrect Password') {
        errors.password = 'Wrong Password';
    }

    // Duplicate Email
    if (err.code === 11000) {
        errors.email = 'Email is already registered';
        
        return errors;
    }

    // Validation Errors
    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// 3 Day      day hour  min  sec
const maxAge = 3 * 24 * 60 * 60;

// Create Token
const createToken = (id) => {
    return jwt.sign({ id }, 'bukan kuu', {
        expiresIn: maxAge
    }); // secret need to be super long
};

// Sign Up
// GET
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

// POST
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({email, password});

        // Create Token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err) {
        const errors = errorHandling(err);
        res.status(400).json({ errors });
    }
}

// Login
// GET
module.exports.login_get = async (req, res) => {
    res.render('login');
}

// POST
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // Create Token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = errorHandling(err);
        res.status(400).json({ errors });
    }
}

// Log Out
// GET
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}