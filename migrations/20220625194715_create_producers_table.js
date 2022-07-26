exports.up = function(knex) {
    return knex.schema.createTable("producers", (table) => {
        table.string("id").primary();
        table.string("image_url").notNullable();
        table.string("name").notNullable();
        table.string("contact").notNullable();
        table.string("username").notNullable();
        table.string("password").notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("producers");
};