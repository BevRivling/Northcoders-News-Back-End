exports.seed = function(knex, Promise) {
  return knex("users")
    .del()
    .then(function() {
      return knex("table_name").insert([
        { id: 1, colName: "rowValue1" },
        { id: 2, colName: "rowValue2" },
        { id: 3, colName: "rowValue3" }
      ]);
    });
};


export.seed = function(knex,Promise) {
    
  return knex("topics").del()
  .then(() => {
    return knex('topics').insert(topicsData).returning('*')
    .then(topicsRows => {
      console.log(topicsRows) // <-- now have access to the topic rows in our database...
    })
}