const db = require('../db/connection');
// const { validateQueries } = require('../utils/');

exports.getAllUsers = (req, res, next) => db('users').select('*')
  .then((users) => {
    if (users) res.status(200).send(users);
    else next({ status: 400 });
  })
  .catch(next);

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  return db('users')
    .select('*')
    .where('username', username)
    .then((user) => {
      if (user.length === 0) return next({ code: 404 });
      if (user.length > 0) res.status(200).send(user);
      else next({ status: 400 });
    });
};
