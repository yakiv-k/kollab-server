const connectionsData = require("../seed_data/connections");

exports.seed = function (knex) {
  return knex("connections")
    .del()
    .then(() => knex("connections").insert(connectionsData));
};
