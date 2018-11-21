const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topics');
const { handle405s } = require('../errors');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(handle405s);

module.exports = { topicsRouter };
