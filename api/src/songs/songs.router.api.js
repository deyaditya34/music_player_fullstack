const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const getSongApi = require('./getSong.api');
const uploadSongApi = require('./uploadSong.api');
const findSongsGenreApi = require('./findSongs.genre.api');
const findSongsArtistApi = require('./findSongs.artist.api');
const mostRecentSongsApi = require('./mostRecentlyAddedSong.api');
const searchSongByNameApi = require('./searchSong.api');

const router = express.Router();

router.get('/search', searchSongByNameApi);
router.get('/genre', findSongsGenreApi);
router.get('/artist', findSongsArtistApi);
router.get('/recentlyAdded', mostRecentSongsApi);
router.get('/:id', getSongApi);
router.use('/static', express.static('uploads'));
router.post('/upload', upload.single('file'), uploadSongApi);

module.exports = router;
