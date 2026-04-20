const Topic = require("../models/topic");
const Message = require("../models/message");
const Subscription = require("../models/Subscription");

// Observer function
const notifySubscribers = async (topicId) => {
  const subs = await Subscription.find({ topicId });

  subs.forEach(sub => {
    console.log(`Notify user ${sub.userId}`);
  });
};

// Create topic
exports.createTopic = async (req, res) => {
  const topic = await Topic.create({ name: req.body.name });

  await Subscription.create({
    userId: req.body.userId,
    topicId: topic._id
  });

  res.redirect(`/topics/dashboard/view/${req.body.userId}`);
};

// Subscribe
exports.subscribe = async (req, res) => {
  await Subscription.create(req.body);
  res.redirect("back");
};

// Unsubscribe
exports.unsubscribe = async (req, res) => {
  await Subscription.deleteOne(req.body);
  res.redirect("back");
};

// Post message
exports.postMessage = async (req, res) => {
  await Message.create(req.body);

  // Observer trigger
  await notifySubscribers(req.body.topicId);

  res.redirect("back");
};

// Dashboard page
exports.getDashboardPage = async (req, res) => {
  const userId = req.params.userId;

  const subs = await Subscription.find({ userId });

  let data = [];

  for (let sub of subs) {
    const topic = await Topic.findById(sub.topicId);

    const messages = await Message.find({ topicId: sub.topicId })
      .sort({ createdAt: -1 })
      .limit(2);

    data.push({
      topicName: topic.name,
      topicId: topic._id,
      messages
    });
  }

  res.render("dashboard", { data, userId });
};

// Stats
exports.stats = async (req, res) => {
  const topics = await Topic.find();
  res.json(topics);
};

// Track access
exports.accessTopic = async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  topic.accessCount++;
  await topic.save();

  res.redirect("back");
};