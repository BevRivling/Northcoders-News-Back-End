const knex = require('knex');

const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: `${process.env.DATABASE_URL}?ssl=true` } : require('../knexfile')[ENV];

module.exports = knex(config);
