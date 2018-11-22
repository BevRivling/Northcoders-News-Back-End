const db = require('../db/connection');

exports.getAllTopics = (req, res, next) => {
  return db('topics')
    .select('*')
    .then((topics) => {
      if (topics) res.status(200).send(topics);
      else next({ status: 400 });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const topicToPost = req.body;
  return db('topics').insert(topicToPost).returning('*')
    .then(([topic]) => {
      if (topic) res.status(201).send(topic);
      else next({ status: 400 });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  // const {}
  return db('topics')
    .leftJoin('articles', 'topics.slug', '=', 'articles.topic')
    .leftJoin('users', 'users.user_id', '=', 'articles.user_id')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .where('topic', topic)
    .groupBy('articles.article_id', 'users.username', 'topics.slug')
    .select('articles.title', 'users.username AS author', 'articles.article_id', 'articles.body', 'articles.votes', 'topic', 'articles.created_at')
    .count('comments.comments_id AS comment_count')
    .then((articles) => {
      console.log(articles)
      res.status(200).send({ msg: articles })
    });
};
