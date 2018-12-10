const db = require("../db/connection");
const { validateQueries } = require("../utils/");
const { articleJoin } = require("../db/utils");

exports.getAllTopics = (req, res, next) =>
  db("topics")
    .select("*")
    .then(topics => {
      if (topics) res.status(200).send({ topics: topics });
      else next({ status: 400 });
    })
    .catch(next);

exports.postTopic = (req, res, next) => {
  const topicToPost = req.body;
  return db("topics")
    .insert(topicToPost)
    .returning("*")
    .then(([topic]) => {
      if (topic) res.status(201).send(topic);
      else next({ status: 400 });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const validQs = validateQueries(
    req.query,
    "limit",
    "sort_by",
    "sort_ascending",
    "p"
  );
  const {
    p = 1,
    limit = 10,
    sort_ascending = false,
    sort_by = "created_at"
  } = validQs;

  return db("topics")
    .leftJoin("articles", "topics.slug", "=", "articles.topic")
    .leftJoin("users", "users.user_id", "=", "articles.user_id")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .where("topic", topic)
    .groupBy("articles.article_id", "users.username", "topics.slug")
    .select(
      "articles.title",
      "users.username AS author",
      "articles.article_id",
      "articles.body",
      "articles.votes",
      "topic",
      "articles.created_at"
    )
    .count("comments.comments_id AS comment_count")
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sort_ascending ? "asc" : "desc")
    .then(articles => {
      if (articles.length === 0) {
        return next({ code: 404 });
      }
      if (articles) res.status(200).send({ msg: articles });
      else next({ status: 400 });
    })
    .catch(next);
};

exports.postArticleByTopic = (req, res, next) => {
  db("users")
    .select("*")
    .then(usersData => {
      const articleBody = articleJoin([req.body], usersData);
      return db("articles")
        .insert(articleBody)
        .returning("*");
    })
    .then(([article]) => {
      if (article) res.status(201).send(article);
      else next({ status: 400 });
    })
    .catch(next);
};
