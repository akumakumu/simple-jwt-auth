// Import Model
const User = require('../models/User');

// Error Handling
const errorHandling = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // Duplicate Email
    if (err.code === 11000) {
        errors.email = 'Email is already registered';
        
        return errors;
    }

    // Validation Errors
    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

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
        res.status(201).json(user)
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
module.exports.login_post = (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    res.send('user login')
}