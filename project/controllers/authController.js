
const User = require('../models/User');

exports.getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Passwords do not match' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.render('auth/register', { error: 'Username or email already taken' });
    }
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Registration failed. Try again.' });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Login failed. Try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
