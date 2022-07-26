const producersData = require("../seed_data/producers");

exports.seed = function (knex) {
  return knex("producers")
    .del()
    .then(() => knex("producers").insert(producersData));
};