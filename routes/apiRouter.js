const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topicsRouter');
const { articlesRouter } = require('../routes/articlesRouter');
const { commentsRouter } = require('../routes/commentsRouter');
const { usersRouter } = require('../routes/usersRouter');
const { getAllEndpoints } = require('../controllers/api');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.get('/', getAllEndpoints);

module.exports = { apiRouter };
