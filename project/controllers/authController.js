const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hash
  });

  res.redirect('/login');
};

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.send("Invalid login");
  }

  req.session.user = user;
  res.redirect('/topics/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};