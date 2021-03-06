const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../db/data');
const { articleJoin, commentJoin } = require('../db/utils');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .del()
    .then(() => knex('topics').insert(topicData))
    .then(() => knex('users')
      .del()
      .insert(userData)
      .returning('*'))
    .then((users) => {
      const validArticleData = articleJoin(articleData, users);
      return Promise.all([
        knex('articles')
          .del()
          .insert(validArticleData)
          .returning('*'),
        users,
      ]);
    })
    .then(([articles, users]) => {
      const validCommentData = commentJoin(commentData, users, articles);
      return knex('comments')
        .del()
        .insert(validCommentData)
        .returning('*');
    });
};
