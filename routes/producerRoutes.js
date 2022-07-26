const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
// const knex = require("knex")(require("../knexfile").development);

require("dotenv").config();

router.use(express.json());

router.route("/producers/:id").get((req, res) => {
  let selectedProducer;
  knex("producers")
    .then((data) => {
      const producer_id = req.params.id;
      selectedProducer = data.find((producer) => producer.id == producer_id);
    })
    .then((response) => {
      knex("tracks").then((data) => {
        const associatedTracks = data.filter(
          (tracks) => tracks.producer_id == selectedProducer.id
        );

        res
          .status(200)
          .json({ producer: selectedProducer, tracks: associatedTracks });
      });
    })
    .catch((err) =>
      res.status(200).send(`Error retrieving Inventories: ${err}`)
    );
});

module.exports = router;
