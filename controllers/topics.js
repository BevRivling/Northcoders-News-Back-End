const db = require('../db/connection');

exports.getAllTopics = (req, res, next) => {
  return db('topics')
    .select('*')
    .then((topics) => {
      console.log(topics)
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
