const songService = require('./songs.service');

async function controller(req, res) {
  const mostRecentSongs = await songService.findMostRecentlySongs(20);

  return res.json({
    success: true,
    data: mostRecentSongs,
  });
}

module.exports = controller;
