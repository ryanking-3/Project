const Message = require('../models/Message');

exports.create = async (req, res) => {
  await Message.create({
    content: req.body.content,
    author: req.session.user._id,
    topic: req.params.id
  });

  res.redirect(`/topics/${req.params.id}`);
};