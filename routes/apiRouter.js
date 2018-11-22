const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topicsRouter');
const { articlesRouter } = require('../routes/articlesRouter');
const { commentsRouter } = require('../routes/commentsRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = { apiRouter };
