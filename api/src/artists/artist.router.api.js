const express = require('express');

const listArtistApi = require('./listArtist.api');

const router = express.Router();

const userResolver = require('../middlewares/userResolver');

router.get('/list', userResolver, listArtistApi);

module.exports = router;
