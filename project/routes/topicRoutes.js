const express = require("express");
const router = express.Router();
const topic = require("../controllers/topicController");

router.post("/create", topic.createTopic);
router.post("/subscribe", topic.subscribe);
router.post("/unsubscribe", topic.unsubscribe);
router.post("/message", topic.postMessage);

router.get("/dashboard/view/:userId", topic.getDashboardPage);

router.get("/stats", topic.stats);
router.get("/access/:id", topic.accessTopic);

module.exports = router;