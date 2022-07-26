exports.up = function (knex) {
    return knex.schema.createTable("connections", (table) => {
      table.increments("id").primary();
      table.string("producer1_id").notNullable();
      table.string("producer2_id").notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("connections");
  };
  