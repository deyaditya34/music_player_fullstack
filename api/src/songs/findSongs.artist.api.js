const songService = require('./songs.service');
const nameFormatter = require('../api-utils/nameFormatter');

async function controller(req, res) {
  const { artistName } = req.query;

  if (!artistName) {
    return res.json({
      success: false,
      message: 'artistName parameter is missing in query',
    });
  }

  const songsList = await songService.findSongsByArtistName(
    nameFormatter(artistName)
  );

  // if (songsList.length < 1) {
  //   return res.json({
  //     success: false,
  //     message: 'song based on artist name not found',
  //   });
  // }

  res.json({
    success: true,
    data: songsList,
  });
}

module.exports = controller;
