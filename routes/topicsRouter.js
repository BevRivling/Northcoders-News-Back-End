const topicsRouter = require('express').Router();
const {
  getAllTopics, postTopic, getArticlesByTopic, postArticleByTopic,
} = require('../controllers/topics');
const { handle405s } = require('../errors');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(handle405s);

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleByTopic)
  .all(handle405s);

module.exports = { topicsRouter };
