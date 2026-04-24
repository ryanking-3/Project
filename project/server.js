const express = require('express');
const session = require('express-session');
require('./config/database');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/', require('./routes/auth'));
app.use('/topics', require('./routes/topics'));

app.get('/', (req, res) => res.redirect('/topics/dashboard'));

app.listen(3000, () => console.log('Server running on port 3000'));