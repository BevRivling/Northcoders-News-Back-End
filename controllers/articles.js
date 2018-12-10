const db = require("../db/connection");
const { validateQueries } = require("../utils/");

exports.getAllArticles = (req, res, next) => {
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
  db("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .leftJoin("users", "users.user_id", "=", "articles.user_id")
    .groupBy("articles.article_id", "users.username")
    .select(
      "articles.article_id",
      "users.username AS author",
      "articles.created_at",
      "articles.title",
      "topic",
      "articles.votes"
    )
    .count("comments.comments_id AS comment_count")
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sort_ascending ? "asc" : "desc")
    .then(articles => {
      if (articles) res.status(200).send({ articles: articles });
      else next({ status: 400 });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  db("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .leftJoin("users", "users.user_id", "=", "articles.user_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id", "users.username")
    .select(
      "articles.article_id",
      "users.username AS author",
      "articles.created_at",
      "articles.title",
      "topic",
      "articles.votes"
    )
    .count("comments.comments_id AS comment_count")
    .then(article => {
      if (article.length === 0) return next({ code: 404 });
      if (article.length > 0) res.status(200).send(article);
      else next({ status: 400 });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const validQs = validateQueries(req.body, "inc_votes");
  const { inc_votes } = validQs;
  db("articles")
    .where("articles.article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length === 0) return next({ code: 404 });
      if (article.length > 0) {
        res.status(202).send(article[0]);
      } else next({ status: 400 });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  db("articles")
    .where("articles.article_id", article_id)
    .del()
    .then(body => {
      if (body === 0) return next({ code: 404 });
      if (body === 1) res.status(204).send({});
      else next({ status: 400 });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
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
  db("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .leftJoin("users", "users.user_id", "=", "articles.user_id")
    .select(
      "comments.comments_id",
      "comments.votes",
      "comments.created_at",
      "users.username AS author",
      "comments.body"
    )
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sort_ascending ? "asc" : "desc")
    .then(comments => {
      if (comments.length === 0) return next({ code: 404 });
      if (comments) res.status(200).send({ comments: comments });
      else next({ status: 400 });
    })
    .catch(next);
};

// Needs 404 handling
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const postedComment = req.body;
  const validation = Object.keys(postedComment);
  if (
    validation.includes("body") &&
    validation.includes("user_id") &&
    validation.length === 2
  ) {
    postedComment.article_id = article_id;
    return db("comments")
      .insert(postedComment)
      .returning("*")
      .then(body => {
        if (body.length === 0) return next({ code: 404 });
        if (body) res.status(201).send(body);
        else return next({ code: 404 });
      })
      .catch(next);
  }
  next({ code: 400 });
};
