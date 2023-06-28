const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// dotEnv
dotenv.config();

// middleware
app.use(express.static('public'));
// express json
app.use(express.json());
// cookie parser
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
// Add database URI on .env file
// dbURI = YourDatabaseURI
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

// Authentication
app.use(authRoutes);