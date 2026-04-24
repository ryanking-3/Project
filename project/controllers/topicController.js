const Topic = require('../models/Topic');
const Message = require('../models/Message');
const User = require('../models/User');
const EventSystem = require('../observers/EventSystem');
const TopicObserver = require('../observers/TopicObserver');

EventSystem.subscribe(TopicObserver);

exports.dashboard = async (req, res) => {
  const topics = await Topic.find({ subscribers: req.session.user._id });

  const data = await Promise.all(
    topics.map(async (t) => {
      const messages = await Message.find({ topic: t._id })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate('author');

      return { topic: t, messages };
    })
  );

  res.render('dashboard', { data });
};

exports.browse = async (req, res) => {
  const topics = await Topic.find();
  const user = await User.findById(req.session.user._id);

  res.render('topics/index', {
    topics,
    subscriptions: user.subscriptions.map(id => id.toString())
  });
};

exports.subscribe = async (req, res) => {
  const userId = req.session.user._id;
  const topicId = req.params.id;

  await Topic.findByIdAndUpdate(topicId, {
    $addToSet: { subscribers: userId }
  });

  await User.findByIdAndUpdate(userId, {
    $addToSet: { subscriptions: topicId }
  });

  res.redirect('/topics');
};

exports.unsubscribe = async (req, res) => {
  const userId = req.session.user._id;
  const topicId = req.params.id;

  await Topic.findByIdAndUpdate(topicId, {
    $pull: { subscribers: userId }
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { subscriptions: topicId }
  });

  res.redirect('/topics/dashboard');
};

exports.create = async (req, res) => {
  const topic = await Topic.create({ title: req.body.title });

  topic.subscribers.push(req.session.user._id);
  await topic.save();

  res.redirect('/topics/dashboard');
};

exports.show = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  const messages = await Message.find({ topic: topic._id }).populate('author');

  EventSystem.notify(topic._id);

  res.render('topics/show', { topic, messages });
};

exports.stats = async (req, res) => {
  const topics = await Topic.find();
  res.render('stats', { topics });
};