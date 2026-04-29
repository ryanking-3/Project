const eventSystem = require('./EventSystem');
const Topic = require('../models/Topic');
class TopicObserver {
  constructor() {
    eventSystem.subscribe('topic:accessed', this.onTopicAccessed.bind(this));
    eventSystem.subscribe('message:posted', this.onMessagePosted.bind(this));
    console.log('TopicObserver initialized and listening');
  }
  async onTopicAccessed({ topicId }) {
    try {
      await Topic.findByIdAndUpdate(topicId, { $inc: { accessCount: 1 } });
    } catch (err) {
      console.error('TopicObserver error on access:', err);
    }
  }
  async onMessagePosted({ topicId, userId }) {
    console.log(`New message posted in topic ${topicId} by user ${userId}`);
  }
}
module.exports = new TopicObserver();