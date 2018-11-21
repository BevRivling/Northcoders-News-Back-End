const userJoin = (rawData, users) => {
  const user_id = users.reduce((searchedData, user) => {
    if (user.username === rawData.created_by) {
      searchedData = user.user_id;
    }
    return searchedData;
  }, []);
  return user_id;
};

const titleJoin = (rawData, articles) => {
  const article_id = articles.reduce((searchedData, article) => {
    if (article.title === rawData.belongs_to) {
      searchedData = article.article_id;
    }
    return searchedData;
  }, []);
  return article_id;
};

const formatDate = data => new Date(data.created_at);

exports.articleJoin = (articles, users) => articles.reduce((validArticles, rawArticle) => {
  const validArt = { ...rawArticle };
  validArt.user_id = userJoin(rawArticle, users);
  delete validArt.created_by;
  validArt.created_at = formatDate(rawArticle);
  validArticles.push(validArt);
  return validArticles;
}, []);

exports.commentJoin = (comments, users, articles) => {
  return comments.reduce((validComments, rawComment) => {
    const validComm = { ...rawComment };
    validComm.user_id = userJoin(rawComment, users);
    delete validComm.created_by;
    validComm.article_id = titleJoin(rawComment, articles);
    delete validComm.belongs_to;
    validComm.created_at = formatDate(rawComment);
    validComments.push(validComm);
    return validComments;
  }, []);
};
