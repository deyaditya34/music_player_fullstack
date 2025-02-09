const express = require("express");

const listGenreApi = require("./listGenre.api");

const router = express.Router();

router.get("/list", listGenreApi);

module.exports = router;