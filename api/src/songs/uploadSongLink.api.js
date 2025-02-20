const { spawn } = require('child_process');
const fs = require('fs');

const nameFormatter = require('../api-utils/nameFormatter');
const artistService = require('../artists/artist.service');
const genreService = require('../genres/genre.service');
const songUtils = require('../api-utils/songUtils');
const songService = require('./songs.service');
const config = require('../config');

async function controller(req, res) {
  const { fileLink, songName, artistName, genres } = req.body;

  if (!fileLink || !songName || !artistName || !genres) {
    return res.redirect('/uploadSongError.html');
  }

  // Checking whether the song already exists in the DB
  const songNameExist = await songService.findOneSongByName(
    `${nameFormatter(songName)}.mp3`
  );

  if (songNameExist) {
    return res.redirect('/uploadSongExist.html');
  }

  if (!fs.existsSync(config.UPLOADS_DIR_TEMP)) {
    fs.mkdirSync(config.UPLOADS_DIR_TEMP);
  }

  const uploadSong = spawn(
    'yt-dlp',
    ['-x', '--audio-format', 'mp3', '--audio-quality', '0', `${fileLink}`],
    {
      cwd: config.UPLOADS_DIR_TEMP,
    }
  );
  uploadSong.on('error', (err) => {
    return res.send(err);
  });

  uploadSong.on('exit', async () => {
    // Formatting the songData, artist and genres list to store in  the DB
    const uploadedSongName = checkNewSong(config.UPLOADS_DIR_TEMP);
    const songData = {};

    if (uploadedSongName) {
      try {
        const songExtension = '.mp3';
        songData.songName = nameFormatter(songName) + songExtension;
        songData.artistName = nameFormatter(artistName);
        songData.genres = nameFormatter(genres).split(',');
        songData.filePath = `${config.UPLOADS_DIR}/${songData.songName}`;
        const songStats = fs.statSync(
          `${config.UPLOADS_DIR_TEMP}/${uploadedSongName}`
        );
        songData.fileSize = songStats.size;
        songData.duration = await songUtils.getDurationFromBuffer(
          `${config.UPLOADS_DIR_TEMP}/${uploadedSongName}`
        );

        // rename the uploaded song
        renameSong(
          `${config.UPLOADS_DIR_TEMP}/${uploadedSongName}`,
          `${config.UPLOADS_DIR_TEMP}/${songData.songName}`
        );

        // move the song to upload dir
        moveSong(
          songData.songName,
          config.UPLOADS_DIR_TEMP,
          config.UPLOADS_DIR
        );

        // delete the song from the server
        deleteSong(songData.songName, config.UPLOADS_DIR_TEMP);
      } catch (err) {
        console.log('error is -', err);

        // delete the songs from the server
        deleteSong(songData.songName, config.UPLOADS_DIR_TEMP);
        deleteSong(songData.songName, config.UPLOADS_DIR);

        return res.redirect('/uploadSongError.html');
      }

      try {
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
      } catch (err) {
        console.log('second error -', err);
        // deleting the song details from DB
        await songService.deleteSongByName(songData.songName);

        // deleting the songs from server
        deleteSong(songData.songName, config.UPLOADS_DIR_TEMP);
        deleteSong(songData.songName, config.UPLOADS_DIR);

        return res.redirect('/uploadSongError.html');
      }

      return res.redirect('/uploadSuccessful.html');
    } else {
      return res.redirect('/uploadSongError.html');
    }
  });
}

function checkNewSong(uploadDir) {
  const dir = fs.readdirSync(uploadDir);
  return dir[0];
}

function renameSong(existingSongName, newSongName) {
  fs.renameSync(existingSongName, newSongName);
}

function moveSong(songName, movingFromDir, movingToDir) {
  const readFile = fs.readFileSync(`${movingFromDir}/${songName}`);
  fs.writeFileSync(`${movingToDir}/${songName}`, readFile);
}

function deleteSong(songName, songDir) {
  if (fs.existsSync(`${songDir}/${songName}`)) {
    fs.rmSync(`${songDir}/${songName}`);
  }
}

module.exports = controller;
