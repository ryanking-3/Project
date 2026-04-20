const User = require("../models/user");

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  res.redirect("/");
};

exports.login = async (req, res) => {
  const user = await User.findOne(req.body);

  if (!user) return res.send("Invalid login");

  res.redirect(`/topics/dashboard/view/${user._id}`);
};