const songService = require('./songs.service');
const nameFormatter = require('../api-utils/nameFormatter');

async function controller(req, res) {
  const { genreName } = req.query;

  if (!genreName) {
    return res.json({
      success: false,
      message: 'genre name is missing from query',
    });
  }

  const songs = await songService.findSongsByGenreName(
    nameFormatter(genreName)
  );

  // if (songs.length < 1) {
  //   return res.json({
  //     success: false,
  //     message: 'no song found for the genre',
  //   });
  // }

  return res.json({
    success: true,
    data: songs,
  });
}

module.exports = controller;
