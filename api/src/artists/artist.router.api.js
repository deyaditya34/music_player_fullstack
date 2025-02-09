const express = require('express');

const listArtistApi = require('./listArtist.api');

const router = express.Router();

router.get('/list', listArtistApi);

module.exports = router;
