const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const { json } = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { url } = require("inspector");

const s3 = new S3Client({ region: "ca-central-1" });

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "kollab-data",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// ROUTING FOR TRACKS
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

// GET ALL
router
  .route("/tracks")
  .get(authorize, (req, res) => {
    const connectionsIdGet = [];
    const token = req.decoded.id;
    const tracks = [];

    // GET CONNECTED PRODUCER ID'S
    knex("connections")
      .where({ producer1_id: token })
      .then((data) => {
        data.filter((connected) => {
          return connectionsIdGet.push(connected.producer2_id);
        });
      });

    knex("tracks").then((data) => {
      // ONLY SEND TRACKS THAT ASSOCIATED WITH CONNECTIONS
      for (id of connectionsIdGet) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].producer_id === id) {
            tracks.push(data[i]);
          }
        }
      }

      res.status(200).json(tracks);
    });
  })
  // POST FROM UPLOAD PAGE
  .post(
    authorize,
    upload.fields([{ name: "image" }, { name: "stems" }, , { name: "track" }]),
    (req, res, next) => {
      const imageData = req.files.image;
      const stemsData = req.files.stems;
      const trackData = req.files.track;
      const userId = req.decoded.id;

      // FUNCTION: ISOLATE URL(S) TO FILE
      function getUrl(fileData) {
        let url = "";

        if (fileData.length === 1) {
          return (url = fileData[0].location);
        } else {
          return fileData.map((stem) => {
            return { name: stem.key, files: stem.location };
          });
        }
      }

      // GRAB PRODUCER NAME BY ID
      knex("producers")
        .where({ id: userId })
        .then((data) => {
          let userName = data[0].name;

          // CREATE NEW TRACK OBJECT
          let newTrack = {
            id: uuidv4(),
            // SET TO CURRENT USER ID
            producer_id: userId,
            title: req.body.title,
            name: userName,
            caption: req.body.caption,
            BPM: req.body.bpm,
            image_url: getUrl(imageData),
            audio_url: getUrl(trackData),
          };

          // INSERT NEW TRACK TO TRACKS TABLE
          knex("tracks")
            .insert(newTrack)
            .then((data) => {});

          // ITERATE THROUGH ARRAY OF STEM FILES, CREATE OBJECT FOR EACH FILE
          const stems = getUrl(stemsData).map((stem) => {
            return {
              id: uuidv4(),
              name: stem.name,
              tracks_id: newTrack.id,
              files: stem.files,
            };
          });

          //UPDATE DB WITH ASSOCIATED PROJECT FILES
          knex("stems")
            .insert(stems)
            .then((data) => {
              res
                .status(200)
                .location("http://localhost:3000/tracks")
                .json(data);
            });
        });
    }
  )
  .patch((req, res) => {
    let currentVal = req.body.liked;
    let currentId = req.body.id;

    knex("tracks")
      .where({ id: currentId })
      .update({ liked: currentVal })
      .then((data) => {
        res.status(201).json(data);
      });
  });

// GET BY ID
router.route("/tracks/:id").get((req, res) => {
  let selectedTrack;

  // Isolate selected track
  knex("tracks")
    .then((data) => {
      const track_id = req.params.id;
      selectedTrack = data.find((track) => track.id == track_id);
    })
    .then((response) => {
      // Isolate all files associated with the selected track
      knex("stems").then((data) => {
        let associatedStems = data.filter((stem) => {
          return stem.tracks_id == selectedTrack.id;
        });
        res.status(200).json({ track: selectedTrack, stems: associatedStems });
      });
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
});

module.exports = router;
