exports.up = function (knex) {
  return knex.schema.createTable("stems", (table) => {
    table.string("id").primary();

    table
      .string("tracks_id")
      .references("id")
      .inTable("tracks")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
      table.string("name").notNullable();
    table.string("files").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("stems");
};
