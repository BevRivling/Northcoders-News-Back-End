const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
  deleteArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/articles');
const { handle405s } = require('../errors');


articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405s);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(handle405s);

articlesRouter.route('/')
  .get(getAllArticles)
  .all(handle405s);

module.exports = { articlesRouter };
