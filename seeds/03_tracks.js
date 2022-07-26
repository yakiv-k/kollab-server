const tracksData = require("../seed_data/tracks");

exports.seed = function (knex) {
  return knex("tracks")
    .del()
    .then(() => knex("tracks").insert(tracksData));
};
