const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topicsRouter');
const { articlesRouter } = require('../routes/articlesRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);


module.exports = { apiRouter };
