const express = require('express');

const listGenreApi = require('./listGenre.api');
const userResolver = require('../middlewares/userResolver');

const router = express.Router();

router.get('/list', userResolver, listGenreApi);

module.exports = router;
