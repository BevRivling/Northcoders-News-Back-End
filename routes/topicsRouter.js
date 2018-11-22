const topicsRouter = require('express').Router();
const { getAllTopics, postTopic, getArticlesByTopic } = require('../controllers/topics');
const { handle405s } = require('../errors');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(handle405s);

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic);

module.exports = { topicsRouter };
