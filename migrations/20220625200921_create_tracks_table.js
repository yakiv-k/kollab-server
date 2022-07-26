exports.up = function (knex) {
  return knex.schema.createTable("tracks", (table) => {
    table.string("id").primary();
    table
      .string("producer_id")
      .references("id")
      .inTable("producers")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("title").notNullable();
    table.string("name").notNullable();
    table.string("caption").notNullable();
    table.string("BPM").notNullable();
    table.string("image_url").notNullable();
    table.string("audio_url").notNullable();
    table.tinyint("liked").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tracks");
};
