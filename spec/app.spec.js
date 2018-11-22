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
    it('POST with a malformed body responds with a 400 and an explaination of the error', () => {
      return request.post(url)
        .send({ slag: 'unique test slug with wrong key', description: 'too many keys', description2: 'way too many keys' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: malformed body');
        });
    });
    it('All http methods except GET and POST return a 405 and an explaination of the error', () => {
      const invalidMethods = ['delete', 'put', 'patch', 'trace', 'options'];
      return Promise.all(invalidMethods.map((method) => {
        return request[method](url)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
          });
      }));
    });
    it('POST with a legitimate request but invalid entity responds with 422 and explaination of the error', () => {
      return request.post(url)
        .send({ slug: 'mitch', description: 'slug - mitch already exists in the table' })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: please insert a unique slug');
        });
    });
    describe.only('/api/topics/:topic/articles', () => {
      const urlTopicArticle = '/api/topics/mitch/articles';
      it('GET returns a 200 and all the articles under a particular topic through a valid topic_id', () => {
        return request.get(urlTopicArticle)
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.be.an('array');
            expect(body.msg.length).to.equal(11);
            expect(body.msg[0]).to.have.all.keys(['title', 'article_id', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']);
          });
      });
    });
  });
});
