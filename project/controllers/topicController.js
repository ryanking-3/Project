const Topic   = require('../models/Topic');
const Message = require('../models/Message');
const User    = require('../models/User');
const eventSystem = require('../observers/EventSystem');
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('subscribedTopics');
    const topicsWithMessages = await Promise.all(
      user.subscribedTopics.map(async (topic) => {
        const messages = await Message.find({ topic: topic._id })
          .sort({ createdAt: -1 })
          .limit(2)
          .populate('author', 'username');
        return { topic, messages };
      })
    );
    res.render('dashboard', { user, topicsWithMessages });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
};
exports.getAllTopics = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const topics = await Topic.find().populate('createdBy', 'username');
    const subscribedIds = user.subscribedTopics.map(id => id.toString());
    res.render('topics/index', { topics, subscribedIds, user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};
exports.getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('createdBy', 'username');
    if (!topic) return res.redirect('/topics');

    // Notify observer — topic was accessed
    eventSystem.notify('topic:accessed', { topicId: topic._id });

    const messages = await Message.find({ topic: topic._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    const user = await User.findById(req.session.userId);
    const isSubscribed = user.subscribedTopics.includes(topic._id);

    res.render('topics/show', { topic, messages, user, isSubscribed });
  } catch (err) {
    console.error(err);
    res.redirect('/topics');
  }
};
exports.getNewTopic = (req, res) => {
  res.render('topics/new', { error: null });
};
exports.postNewTopic = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await Topic.findOne({ title: title.trim() });
    if (existing) {
      return res.render('topics/new', { error: 'A topic with that title already exists.' });
    }
    const topic = new Topic({
      title,
      description,
      createdBy: req.session.userId,
      subscribers: [req.session.userId]
    });
    await topic.save();
    // Auto-subscribe creator
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: { subscribedTopics: topic._id }
    });
    res.redirect(`/topics/${topic._id}`);
  } catch (err) {
    console.error(err);
    res.render('topics/new', { error: 'Failed to create topic.' });
  }
};
exports.subscribe = async (req, res) => {
  try {
    const topicId = req.params.id;
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: { subscribedTopics: topicId }
    });
    await Topic.findByIdAndUpdate(topicId, {
      $addToSet: { subscribers: req.session.userId }
    });
    res.redirect(req.headers.referer || '/topics');
  } catch (err) {
    console.error(err);
    res.redirect('/topics');
  }
};
exports.unsubscribe = async (req, res) => {
  try {
    const topicId = req.params.id;
    await User.findByIdAndUpdate(req.session.userId, {
      $pull: { subscribedTopics: topicId }
    });
    await Topic.findByIdAndUpdate(topicId, {
      $pull: { subscribers: req.session.userId }
    });
    res.redirect(req.headers.referer || '/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// Statistics route — access count per topic
exports.getStats = async (req, res) => {
  try {
    const topics = await Topic.find()
      .sort({ accessCount: -1 })
      .populate('createdBy', 'username');
    res.render('stats', { topics });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const topicId = req.params.id;

    // Create the message and link it to the topic and user
    const message = new Message({
      content,
      topic: topicId,
      author: req.session.userId
    });

    await message.save();

    // Redirect back to the topic page to see the new message
    res.redirect(`/topics/${topicId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/topics/${req.params.id}`);
  }
};