# BE2-NC-Knews

## Northcoders News API

### Background

An API for accessing the data of the NC Knews application.

### Prerequisites

Either open the heroku link from here or clone the repository.

To install the dependencies, run `npm i` and `npm i knex`.

The `knexfile.js` should be populated with your own details and if on linux a username and password that you initialised psql on.



### Running the tests

All tests can be run by simply running the command `npm t` in your terminal.


### Endpoints

The server has the following endpoints:
- GET /api/topics
- POST /api/topics
- GET /api/topics/:topic/articles
- POST /api/topics/:topic/articles
- GET /api/articles
- GET /api/articles/:article_id
- PATCH /api/articles/:article_id
- DELETE /api/articles/:article_id
- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments
- PATCH /api/comments/:comment_id
- DELETE /api/comments/:comment_id
- GET /api/users
- GET /api/users/:username
- GET /api 

#### Built With
- `Express`
- `Body-Parser`
- `Knex`
- `Pg-Promise`

#### Tested With
- `chai`
- `mocha`
- `supertest`

### Hosted On
[heroku](https://saucy-mendicant.herokuapp.com/api/)