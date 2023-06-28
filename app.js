const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');

const app = express();

// middleware
app.use(express.static('public'));
// express json
app.use(express.json());
// cookie parser
app.use(cookieParser());
// Authentication
app.use(authRoutes);

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = "mongodb+srv://yy:doubleyou@dmarket.6nhrdjz.mongodb.net/yy_auth";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

// cookies
app.get('/set-cookies', (req, res) => {
  //res.setHeader('Set-Cookie', 'newUser=true');
  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 24, httpOnly: true }); // Max Cookie Age 1 Day 1000ms x 60 x 24, secure: true = HTTPS

  res.send('you got the cookies!');
})

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  //console.log(cookies)
  console.log(cookies.newUser);

  res.json(cookies);
})