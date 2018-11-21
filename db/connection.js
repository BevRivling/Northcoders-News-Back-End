const knex = require('knex');

const ENV = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[ENV];

module.exports = knex(config);
