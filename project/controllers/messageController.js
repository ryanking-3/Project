const Message = require('../models/Message');
const Topic   = require('../models/Topic');
const User    = require('../models/User');
const eventSystem = require('../observers/EventSystem');
exports.postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const topicId = req.params.topicId;
    const user = await User.findById(req.session.userId);
    if (!user.subscribedTopics.includes(topicId)) {
      return res.redirect(`/topics/${topicId}`);
    }

    const message = new Message({
      content,
      author: req.session.userId,
      topic:  topicId
    });
    await message.save();
    eventSystem.notify('message:posted', { topicId, userId: req.session.userId });

    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/topics/${req.params.topicId}`);
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.redirect('/dashboard');
    if (message.author.toString() !== req.session.userId.toString()) {
      return res.redirect('/dashboard');
    }
    const topicId = message.topic;
    await message.deleteOne();
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};
