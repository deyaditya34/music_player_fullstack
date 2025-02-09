const songService = require('./songs.service');

async function controller(req, res) {
  const { searchSong } = req.query;

  if (!searchSong) {
    return res.json({
      status: false,
      message: 'query params missing in the request',
    });
  }

  const songs = await songService.searchSongByName(searchSong);

  return res.json({
    success: true,
    data: songs
  })
}

module.exports = controller;
