const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const getSongApi = require('./getSong.api');
const uploadSongApi = require('./uploadSong.api');
const findSongsGenreApi = require('./findSongs.genre.api');
const findSongsArtistApi = require('./findSongs.artist.api');
const mostRecentSongsApi = require('./mostRecentlyAddedSong.api');
const searchSongByNameApi = require('./searchSong.api');
const uploadFileLinkApi = require("./uploadSongLink.api")

const userResolver = require("../middlewares/userResolver")

const router = express.Router();

router.get('/search', userResolver, searchSongByNameApi);
router.get('/genre', userResolver, findSongsGenreApi);
router.get('/artist', userResolver, findSongsArtistApi);
router.get('/recentlyAdded', userResolver, mostRecentSongsApi);
router.get('/:id', userResolver, getSongApi);
router.use('/static', userResolver, express.static('uploads'));
router.post('/upload', userResolver, upload.single('file'), uploadSongApi);
router.post("/upload-link", userResolver, uploadFileLinkApi)

module.exports = router;
