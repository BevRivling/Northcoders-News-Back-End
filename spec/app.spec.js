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
    // *** /API/TOPICS ***

    const url = '/api/topics';
    it('GET responds with a 200 and an array of topic objects', () => request
      .get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('array');
        expect(body.length).to.equal(2);
      }));
    it('POST responds with a 201 and the posted topic object', () => request.post(url)
      .send({ slug: 'unique test slug', description: 'generic test description' })
      .expect(201)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body.slug).to.equal('unique test slug');
      }));
    it('POST with a malformed body responds with a 400 and an explaination of the error', () => request.post(url)
      .send({ slag: 'unique test slug with wrong key', description: 'too many keys', description2: 'way too many keys' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Bad Request: malformed body');
      }));
    it('All http methods except GET and POST return a 405 and an explaination of the error', () => {
      const invalidMethods = ['delete', 'put', 'patch', 'trace', 'options'];
      return Promise.all(invalidMethods.map(method => request[method](url)
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
        })));
    });
    it('POST with a legitimate request but invalid entity responds with 422 and explaination of the error', () => request.post(url)
      .send({ slug: 'mitch', description: 'slug - mitch already exists in the table' })
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).to.equal('Bad Request: please insert a unique slug');
      }));
    describe('/api/topics/:topic/articles', () => {
      const urlTopicArticle = '/api/topics/mitch/articles';
      it('GET returns a 200 and all the articles under a particular topic through a valid topic_id', () => request.get(urlTopicArticle)
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).to.be.an('array');
          expect(body.msg.length).to.equal(10);
          expect(body.msg[0]).to.have.all.keys(['title', 'article_id', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']);
        }));
      it('GET applies valid queries on the results while ignoring the invalid ones', () => Promise.all([request.get(`${urlTopicArticle}?limit=5`).expect(200).then(({ body }) => {
        expect(body.msg.length).to.equal(5);
      }),
      request.get(`${urlTopicArticle}?p=2`).expect(200).then(({ body }) => {
        expect(body.msg[0].title).to.equal('Moustache');
      }),
      request.get(`${urlTopicArticle}?sort_by=topic&sort_ascending=true`).expect(200).then(({ body }) => {
        expect(body.msg[0].title).to.equal('They\'re not exactly dogs, are they?');
      }), request.get(`${urlTopicArticle}?turkey=false&captain_birdseye=99`).expect(200).then(({ body }) => {
        expect(body.msg.length).to.equal(10);
      })]));
      it('POST returns a 201 and returns the article posted', () => {
        const article = {
          title: 'This hurts my head',
          topic: 'cats',
          created_by: 'rogersop',
          body: 'There are too many endpoints for this sprint!',
          created_at: 1500584273257,
        };
        request.post(urlTopicArticle)
          .send(article)
          .expect(201)
          .then(({ body }) => {
            expect(body).to.be.an('object');
            expect(body.title).to.equal('This hurts my head');
          });
      });
      it('POST with a malformed body responds with a 400 and an explaination of the error', () => request.post(url)
        .send({ body: 'malformed', yeah: 'what' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: malformed body');
        }));
      it('GET and POST with incorrect parametric endpoints return a 404', () => request.get(`${url}/bevan/articles`).expect(404).then(({ body }) => {
        expect(body.msg).to.equal('Page not found');
      }));
      it('All http methods except GET and POST return a 405 and an explaination of the error', () => {
        const invalidMethods = ['delete', 'put', 'patch', 'trace', 'options'];
        return Promise.all(invalidMethods.map(method => request[method](urlTopicArticle)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
          })));
      });
    });
  });

  // *** /API/ARTICLES ***

  describe('/api/articles', () => {
    const url = '/api/articles';
    it('GET responds with a 200 and an array of topic objects', () => request
      .get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('array');
        expect(body[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
      }));
    it('GET applies valid queries on the results while ignoring the invalid ones', () => Promise.all([request.get(`${url}?limit=5`).expect(200).then(({ body }) => {
      expect(body.length).to.equal(5);
    }),
    request.get(`${url}?p=2`).expect(200).then(({ body }) => {
      expect(body[0].title).to.equal('Am I a cat?');
    }),
    request.get(`${url}?sort_by=topic&sort_ascending=true`).expect(200).then(({ body }) => {
      expect(body[0].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
    }), request.get(`${url}?turkey=false&captain_birdseye=99`).expect(200).then(({ body }) => {
      expect(body).to.be.an('array');
      expect(body.length).to.equal(10);
    })]));
    describe('/api/articles/:article_id', () => {
      it('GET returns a 200 and an article object when passed a valid article_id', () => request.get(`${url}/1`).expect(200).then(({ body }) => {
        expect(body[0]).to.be.an('object');
      }));
      it('PATCH returns a 202 and increments the targeted article\'s vote property by the designated amount', () => request.patch(`${url}/1`)
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body }) => {
          expect(body.votes).to.equal(101);
        }));
      it('DELETE removes the article, returns a 204 status and an empty object', () => request.delete(`${url}/1`).expect(204).then(({ body }) => {
        expect(body).to.eql({});
      }));
      it('GET, PATCH, and DELETE with incorrect parametric endpoints return a 404', () => Promise.all([
        request.get(`${url}/99`).expect(404).then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        }),
        request.patch(`${url}/99`).expect(404).then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        }),
        request.delete(`${url}/99`).expect(404).then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        })]));
      it('All http methods except GET, PATCH, and DELETE return a 405 and an explaination of the error', () => {
        const invalidMethods = ['post', 'put', 'trace', 'options'];
        return Promise.all(invalidMethods.map(method => request[method](url)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
          })));
      });
    });
    describe('/api/articles/:article_id/comments', () => {
      const urlArticleComments = '/api/articles/1/comments';
      it('GET returns a 200 and an array of the comments associated with a valid article_id', () => request.get(`${urlArticleComments}`).expect(200).then(({ body }) => {
        expect(body).to.be.an('array');
        expect(body.length).to.equal(10);
        expect(body[0]).to.have.all.keys(['author', 'body', 'comments_id', 'created_at', 'votes']);
      }));
      it('GET applies valid queries on the results while ignoring the invalid ones', () => Promise.all([
        request.get(`${urlArticleComments}?limit=3`).expect(200).then(({ body }) => {
          expect(body.length).to.equal(3);
        }),
        request.get(`${urlArticleComments}?p=2`).expect(200).then(({ body }) => {
          expect(body[0].comments_id).to.equal(10);
        }),
        request.get(`${urlArticleComments}?sort_by=topic&sort_ascending=true`).expect(200).then(({ body }) => {
          expect(body[0].comments_id).to.equal(1);
        }), request.get(`${urlArticleComments}?turkey=false&captain_birdseye=99`).expect(200).then(({ body }) => {
          expect(body).to.be.an('array');
          expect(body.length).to.equal(10);
        })]));
      it('POST returns a 201 and the posted comment', () => request.post(`${urlArticleComments}`)
        .send({
          body:
            'This is my body',
          user_id: 1,
        })
        .expect(201)
        .then(({ body }) => {
          expect(body[0]).to.be.an('object');
        }));

      it('POST with a malformed body responds with a 400 and an explaination of the error', () => request.post(urlArticleComments)
        .send({ bodily: 'body with wrong key', user_id: 'hello' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: malformed body');
        }));

      it('POST with incorrect parametric endpoints return a 404', () => request.post('/api/articles/99/comments')
        .send({
          body:
              'This is my body',
          user_id: 1,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        }));
      it('GET with incorrect parametric endpoints return a 404', () => request.get('/api/articles/99/comments').expect(404).then(({ body }) => {
        expect(body.msg).to.equal('Page not found');
      }));
      it('All http methods except GET and POST return a 405 and an explaination of the error', () => {
        const invalidMethods = ['delete', 'put', 'patch', 'trace', 'options'];
        return Promise.all(invalidMethods.map(method => request[method](url)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
          })));
      });
    });
  });

  // *** /API/COMMENTS ***

  describe('/api/comments', () => {
    describe('/api/comments/:comment_id', () => {
      const url = '/api/comments';
      it('PATCH returns a 202 increments the targeted comment\'s vote property by the designated amount', () => Promise.all([request.patch(`${url}/1`)
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body }) => {
          expect(body[0].votes).to.equal(101);
        }),
      request.patch(`${url}/1`)
        .send({ inc_votes: -13 })
        .expect(202)
        .then(({ body }) => {
          expect(body[0].votes).to.equal(88);
        })]));
      it('DELETE removes the comment, returns a 204 status and an empty object', () => request.delete(`${url}/1`)
        .expect(204)
        .then(({ body }) => {
          expect(body).to.eql({});
        }));
      it('GET, and POST with incorrect parametric endpoints return a 404', () => Promise.all([
        request.patch(`${url}/99`).expect(404).then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        }),
        request.delete(`${url}/99`).expect(404).then(({ body }) => {
          expect(body.msg).to.equal('Page not found');
        })]));
      it('All http methods except PATCH and DELETE return a 405 and an explaination of the error', () => {
        const invalidMethods = ['post', 'put', 'get', 'trace', 'options'];
        return Promise.all(invalidMethods.map(method => request[method](url)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
          })));
      });
    });
  });

  // *** /API/USERS ***

  describe('/api/users', () => {
    const url = '/api/users';
    it('GET returns a 200 and an array of user objects', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('array');
        expect(body.length).to.equal(3);
        expect(body[0]).to.have.all.keys(['user_id', 'username', 'avatar_url', 'name']);
      }));
    describe('/api/users/:username', () => {
      it('GET returns a 200 and a user with the associated username', () => request.get(`${url}/butter_bridge`)
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.be.an('object');
          expect(body[0].username).to.equal('butter_bridge');
        }));
    });
    it('GET with an incorrect parametric endpoint return a 404', () => request.get(`${url}/incorrect_username`).expect(404).then(({ body }) => {
      expect(body.msg).to.equal('Page not found');
    }));
    it('All http methods except GET return a 405 and an explaination of the error', () => {
      const invalidMethods = ['delete', 'post', 'put', 'patch', 'trace', 'options'];
      return Promise.all(invalidMethods.map(method => request[method](url)
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request: method not available for this endpoint');
        })));
    });
  });

  // *** /API ***

  describe('/api', () => {
    it('GET returns a JSON object describing all the available endpoints', () => request.get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body).to.have.keys(['Articles', 'Comments', 'Topics', 'Users']);
        expect(body.Articles).to.have.keys(['GET', 'POST', 'PATCH', 'DELETE']);
      }));
  });
});
