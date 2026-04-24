const Topic = require('../models/Topic');

class TopicObserver {
  async update(topicId) {
    await Topic.findByIdAndUpdate(topicId, {
      $inc: { accessCount: 1 }
    });
  }
}

module.exports = new TopicObserver();
