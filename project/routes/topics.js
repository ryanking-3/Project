// routes/topics.js
const express = require('express');
const router  = express.Router();
const topicController   = require('../controllers/topicController');
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

router.get('/',           requireAuth, topicController.getAllTopics);
router.get('/new',        requireAuth, topicController.getNewTopic);
router.post('/',          requireAuth, topicController.postNewTopic);
router.get('/:id',        requireAuth, topicController.getTopic);
router.post('/:id/subscribe',   requireAuth, topicController.subscribe);
router.post('/:id/unsubscribe', requireAuth, topicController.unsubscribe);

// Messages within a topic
router.post('/:topicId/messages',        requireAuth, messageController.postMessage);
router.post('/messages/:id/delete',      requireAuth, messageController.deleteMessage);

module.exports = router;
