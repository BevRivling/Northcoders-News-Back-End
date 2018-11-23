const db = require('../db/connection');
const { validateQueries } = require('../utils/');


exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const validQs = validateQueries(req.body, 'inc_votes');
  const { inc_votes } = validQs;
  db('comments')
    .where('comments.comments_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) return next({ code: 404 });
      if (comment) res.status(202).send(comment);
      else next({ status: 400 });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  db('comments')
    .where('comments.comments_id', comment_id)
    .del()
    .then((body) => {
      if (body === 0) return next({ code: 404 });
      if (body === 1) res.status(204).send({});
      else next({ status: 400 });
    })
    .catch(next);
};
