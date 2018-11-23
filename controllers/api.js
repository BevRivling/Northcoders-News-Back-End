exports.getAllEndpoints = (req, res, next) => {
  const endpointObj = {
    Users: { GET: { getAllUsers: '/api/users/', getUserById: '/api/users/:username' } },
    Topics: { GET: { getAllTopics: '/api/topics/', getArticlesByTopic: '/api/topics/:topic/articles' }, POST: { postTopic: '/api/topics/', postArticleByTopic: '/api/topics/:topic/article' } },
    Articles: {
      GET: { getAllArticles: '/api/articles', getArticleById: '/api/articles:article_id', getCommentsByArticleId: '/api/articles/:article_id/comments' }, POST: { postCommentByArticleId: '/api/articles/:article_id/comments' }, PATCH: { patchArticleById: '/api/articles/:article_id' }, DELETE: { deleteArticleById: '/api/articles/:article_id' },
    },
    Comments: { PATCH: { patchCommentById: '/api/comments/comments_id' }, DELETE: { deleteCommentById: '/api/comments/comments_id' } },
  };
  return res.status(200).send(endpointObj);
};
