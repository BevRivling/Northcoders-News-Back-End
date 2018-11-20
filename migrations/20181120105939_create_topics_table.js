exports.up = function(knex, Promise) {
  console.log("creating topics table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
    topicsTable.unique("slug");
  });
};
exports.down = function(knex, Promise) {
  console.log("dropping topics table");
  return knex.schema.dropTable("topics");
};
