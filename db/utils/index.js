const userJoin = (rawData, users) => {
  rawData.user_id = users.filter(user => {
    if (user.username === rawData.created_by) return user.user_id;
  })[0].user_id;
  delete rawData.created_by;
  return rawData;
};

const titleJoin = (rawData, articles) => {
  rawData.article_id = articles.filter(article => {
    if (article.title === rawData.belongs_to) return article.article_id;
  });
  console.log(rawData.article_id);
  delete rawData.belongs_to;
  return rawData;
};

const formatDate = data => new Date(data.created_at);

exports.articleJoin = (articles, users) => {
  return articles.reduce((validArticles, rawArticle) => {
    rawArticle = userJoin(rawArticle, users);
    rawArticle.created_at = formatDate(rawArticle);
    validArticles.push(rawArticle);
    return validArticles;
  }, []);
};

exports.commentJoin = (comments, users, articles) => {
  return comments.reduce((validComments, rawComment) => {
    rawComment = userJoin(rawComment, users);
    rawComment.article_id = titleJoin(rawComment, articles);
    rawComment.created_at = formatDate(rawComment);
    validComments.push(rawComment);
    return validComments;
  }, []);
};
