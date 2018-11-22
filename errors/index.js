exports.handle400s = (err, req, res, next) => {
  const codesRef400 = { 42703: 'Bad Request: malformed body', 400: 'Bad Request: malformed body' };
  if (codesRef400[err.code]) {
    res.status(400).send({ msg: codesRef400[err.code] });
  } else next(err);
};

exports.handle404s = (err, req, res, next) => {
  const codesRef404 = { 22007: 'Page not found', 404: 'Page not found' };
  if (codesRef404[err.code]) {
    res.status(400).send({ msg: codesRef404[err.code] });
  } else next(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Bad Request: method not available for this endpoint' });
};

exports.handle422s = (err, req, res, next) => {
  const codesRef422 = { 23505: 'Bad Request: please insert a unique slug', 422: 'Bad Request, Mate: please insert a unique slug m8' };
  if (codesRef422[err.code]) {
    res.status(422).send({ msg: codesRef422[err.code] });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'internal server error' });
};
