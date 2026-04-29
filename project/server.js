require('dotenv').config();
const express        = require('express');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const methodOverride = require('method-override');
const path           = require('path');
const db = require('./config/database');
db.connect();
require('./observers/TopicObserver');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'messageboard_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret', // Use a long random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI // Connects sessions to your Singleton DB
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production', // true for Render, false for Local
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use((req, res, next) => {
  res.locals.sessionUser   = req.session.username || null;
  res.locals.sessionUserId = req.session.userId   || null;
  next();
});
const authRoutes      = require('./routes/auth');
const topicRoutes     = require('./routes/topics');
const topicController = require('./controllers/topicController');
const { requireAuth } = require('./middleware/auth');
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});
app.get('/dashboard', requireAuth, topicController.getDashboard);
app.get('/stats',     requireAuth, topicController.getStats);
app.use('/',       authRoutes);
app.use('/topics', topicRoutes);
app.use((req, res) => res.status(404).render('404'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
