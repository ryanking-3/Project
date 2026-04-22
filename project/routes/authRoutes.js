require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { User, Topic, Message } = require('./models/Schemas');
const observer = require('./utils/observer');
require('./config/db'); // Initialize Singleton Connection

const app = express();

// 1. VIEW ENGINE SETUP (Fixes the Render "Lookup View" Error)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 2. MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'p1-secret-key',
  resave: false,
  saveUninitialized: false
}));

// 3. AUTH ROUTES (The code you just shared)
app.get('/login', (req, res) => res.render('login'));

app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({ username, password });
        req.session.userId = newUser._id;
        res.redirect('/dashboard');
    } catch (err) {
        res.send("Registration failed. <a href='/login'>Try again</a>");
    }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
        res.send("Invalid login. <a href='/login'>Go back</a>");
    }
});

// 4. TOPIC & DASHBOARD ROUTES (Matching your dashboard logic)
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  
  const user = await User.findById(req.session.userId).populate('subscriptions');
  
  // Requirement: 2 most recent messages per topic
  const data = await Promise.all(user.subscriptions.map(async (topic) => {
    const messages = await Message.find({ topicId: topic._id })
      .sort({ createdAt: -1 })
      .limit(2);
    return {
      topicName: topic.name,
      topicId: topic._id,
      messages: messages
    };
  }));

  res.render('dashboard', { data, userId: req.session.userId });
});

app.post('/topics/create', async (req, res) => {
  const newTopic = await Topic.create({ name: req.body.name });
  await User.findByIdAndUpdate(req.body.userId, { $addToSet: { subscriptions: newTopic._id } });
  res.redirect('/dashboard');
});

app.post('/topics/message', async (req, res) => {
  const { topicId, userId, content } = req.body;
  await Message.create({ topicId, userId, content });
  
  // OBSERVER PATTERN TRIGGER
  observer.emit('messageAdded', { topicId, userId });
  
  res.redirect('/dashboard');
});

app.post('/topics/unsubscribe', async (req, res) => {
  await User.findByIdAndUpdate(req.body.userId, { $pull: { subscriptions: req.body.topicId } });
  res.redirect('/dashboard');
});

app.get('/topics/access/:id', async (req, res) => {
  // STATISTICS REQUIREMENT: Count the hit
  await Topic.findByIdAndUpdate(req.params.id, { $inc: { accessCount: 1 } });
  res.send("Topic accessed! <a href='/dashboard'>Return to Dashboard</a>");
});

app.get('/topics/stats', async (req, res) => {
  const stats = await Topic.find({});
  res.json(stats); 
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));