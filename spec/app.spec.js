process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const { app } = require('../app');

const request = supertest(app);

const knextion = require('../db/connection');

describe('/', () => {
  beforeEach(() => knextion.migrate
    .rollback()
    .then(() => knextion.migrate.latest())
    .then(() => knextion.seed.run()));
  after(() => knextion.destroy());
  describe('/api/topics', () => {
    const url = '/api/topics';
    it('GET responds with a 200 and an array of topic objects', () => {
      return request
        .get(url)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('array');
          expect(body.length).to.equal(2);
        });
    });
    it('POST responds with a 201 and the posted topic object', () => {
      return request.post(url)
        .send({ slug: 'unique test slug', description: 'generic test description' })
        .expect(201)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.slug).to.equal('unique test slug');
        });
    });
  });
});
