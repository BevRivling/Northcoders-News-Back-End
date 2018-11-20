exports.up = function(knex, Promise) {
  console.log("creating articles table");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug");
    articlesTable.integer("user_id").references("users.user_id");
    articlesTable.datetime("created_at", 6).defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  console.log("dropping articles table");
  return knex.schema.dropTable("articles");
};
