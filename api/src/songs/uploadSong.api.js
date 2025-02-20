const httpError = require('http-errors');
const fs = require('fs');

const nameFormatter = require('../api-utils/nameFormatter');
const artistService = require('../artists/artist.service');
const genreService = require('../genres/genre.service');
const songUtils = require('../api-utils/songUtils');
const songService = require('./songs.service');
const config = require('../config');

async function controller(req, res) {
  const file = req.file;
  const { songName, artistName, genres } = req.body;

  if (!songName || !artistName || !genres || !file) {
    throw httpError.BadRequest('missing parameters in the request');
  }

  // Formatting the songData, artist and genres list to store in  the DB
  const songData = {};
  const songExtensionStartIndex = file.originalname.lastIndexOf('.');
  const songExtension = file.originalname.slice(
    songExtensionStartIndex,
    file.originalname.length
  );
  songData.songName = nameFormatter(songName) + songExtension;

  // Renaming the upload file
  fs.renameSync(file.path, `${config.UPLOADS_DIR}/${songData.songName}`);

  songData.artistName = nameFormatter(artistName);
  songData.genres = nameFormatter(genres).split(',');
  songData.filePath = `${config.UPLOADS_DIR}/${songData.songName}`;
  const songStats = fs.statSync(songData.filePath);
  songData.fileSize = songStats.size;
  songData.duration = await songUtils.getDurationFromBuffer(songData.filePath);

  // Checking whether the song already exists in the DB
  const songNameExist = await songService.findOneSongByName({
    songName: songData.songName,
  });

  if (songNameExist) {
    return res.redirect('/uploadSongExist.html');
  }

  // Formatting the genre and filtering the duplicate genres in the DB
  const genreFormatted = songUtils.genreFormatter(songData.genres);
  let genreFiltered = [];
  for (const genre of genreFormatted) {
    const existGenre = await genreService.findOneGenre(genre);

    if (!existGenre) {
      genreFiltered.push(genre);
    }
  }

  // Filtering the existing artist from the DB
  const artistExist = await artistService.findOneArist({
    artistName: songData.artistName,
  });

  // Inserting the songData, artist and the unique genres in the DB
  await songService.insertSong(songData);

  genreFiltered.length > 0
    ? await genreService.insertGenres(genreFormatted)
    : '';

  !artistExist
    ? await artistService.insertArtist({
        artistName: songData.artistName,
      })
    : '';

  return res.redirect('/uploadSuccessful.html');
}

module.exports = controller;
