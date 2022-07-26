const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.use(express.json());

// AUTH MIDDLEWARE
function authorize(req, res, next) {
  let token = req.headers.authorization.slice("Bearer ".length);
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "No token" });
    } else {
      req.decoded = decoded;
      next();
    }
  });
}

router.route("/profile").get(authorize, (req, res) => {
  let profile;
  let likedTracks;
  let userId = req.decoded.id;

  knex("producers")
    .where({ id: userId })
    .then((data) => {
      profile = data[0];
    })
    .then((response) => {
      knex("tracks")
        .where({ liked: 1 })
        .then((data) => {
          likedTracks = data;
          res.status(200).json({ profile, likedTracks });
        });
    })
    .catch((err) =>
      res.status(200).send(`Error retrieving Inventories: ${err}`)
    );
});

module.exports = router;
