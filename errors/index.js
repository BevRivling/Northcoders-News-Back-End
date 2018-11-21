exports.handle400s = (err, req, res, next) => {
  const psqlCodes = ['22P02', '23502', '23514'];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.msg || 'Bad Request' });
  } else next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err.msg === 'page not found') {
    res.status(404).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
};
