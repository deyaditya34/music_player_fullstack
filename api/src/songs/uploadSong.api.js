const httpError = require('http-errors');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const songService = require('./songs.service');
const artistService = require('../artists/artist.service');
const genreService = require('../genres/genre.service');
const nameFormatter = require('../api-utils/nameFormatter');

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

  // Fixing the upload file for proper streaming
  fs.renameSync(file.path, `uploads/${songData.songName}`);

  songData.artistName = nameFormatter(artistName);
  songData.genres = nameFormatter(genres).split(',');
  songData.filePath = `uploads/${songData.songName}`;
  const songStats = fs.statSync(songData.filePath);
  songData.fileSize = songStats.size;
  songData.duration = await getDurationFromBuffer(songData.filePath);

  // Checking whether the song already exists in the DB
  const songNameExist = await songService.findOneSongByName({
    songName: songData.songName,
  });

  if (songNameExist) {
    return res.redirect('/uploadSongExist.html');
  }

  // Formatting the genre and filtering the duplicate genres in the DB
  const genreFormatted = genreFormatter(songData.genres);
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

function genreFormatter(genres = []) {
  let result = [];

  genres.forEach((genre) => {
    result.push({ genreName: genre });
  });

  return result;
}

function getDurationFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    ffmpeg.setFfprobePath(ffprobePath);
    ffmpeg.ffprobe(buffer, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration);
    });
  });
}

module.exports = controller;
