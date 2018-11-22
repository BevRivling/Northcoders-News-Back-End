const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articles');
const { handle405s } = require('../errors');

articlesRouter.route('/')
  .get(getAllArticles)
  .all(handle405s);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .all(handle405s);

module.exports = { articlesRouter };
