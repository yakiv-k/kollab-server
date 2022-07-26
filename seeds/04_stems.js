const stemsData = require("../seed_data/stems");

exports.seed = function (knex) {
  return knex("stems")
    .del()
    .then(() => knex("stems").insert(stemsData));
};
