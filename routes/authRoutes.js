const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
const SECRET_KEY = process.env.SECRET_KEY;
const { v4: uuidv4 } = require("uuid");

router.post("/signup", (req, res) => {
  const { username, name, password, contact, avatar, image_url } = req.body;

  // CREATE NEW PRODUCER/USER OBJECT
  let newProducer = {
    id: uuidv4(),
    image_url: image_url,
    name: name,
    contact: contact,
    image_url: avatar,
    username: username,
    password: password,
  };
// UPDATE DATABASE WITH NEW USER
  knex("producers")
    .insert(newProducer)
    .then((data) => {
      res
        .status(200)
        .location("http://localhost:3000/signup")
        .json(newProducer);
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
// CONFIRM USER CREDENTIALS
  knex("producers")
    .where({ username: username })
    .andWhere({ password: password })
    .then((data) => {
      if (data.length) {
        let token = jwt.sign({ id: data[0].id }, SECRET_KEY);
        return res.json({ token: token });
      } else {
        return res.status(403).send({ token: null });
      }
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
});

module.exports = router;
