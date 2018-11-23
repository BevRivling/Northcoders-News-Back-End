exports.up = function (knex, Promise) {
  // console.log('creating comments table');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comments_id').primary();
    commentsTable.integer('user_id').references('users.user_id');
    commentsTable.integer('article_id').references('articles.article_id').onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.datetime('created_at', 6).defaultTo(knex.fn.now(6));
    commentsTable.text('body').notNullable();
  });
};
exports.down = function (knex, Promise) {
  // console.log('dropping comments table');
  return knex.schema.dropTable('comments');
};
