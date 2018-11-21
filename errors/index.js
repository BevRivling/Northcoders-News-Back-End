exports.handle400s = (err, req, res, next) => {
  const codesRef400 = { 42703: 'Bad Request: malformed body' };
  if (codesRef400[err.code]) {
    res.status(400).send({ msg: codesRef400[err.code] });
  } else next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err.msg === 'page not found') {
    res.status(404).send({ msg: err.msg });
  } else next(err);
};

exports.handle405s = (req, res, next) => {

  console.log('calling 405s');
  console.log(req.method, '<--- request method')
  res.status(405).send({ msg: 'Bad Request: method not available for this endpoint' });
};

exports.handle422s = (err, req, res, next) => {
  const codesRef422 = { 23505: 'Bad Request: please insert a unique slug' };
  if (codesRef422[err.code]) {
    res.status(422).send({ msg: codesRef422[err.code] });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
};