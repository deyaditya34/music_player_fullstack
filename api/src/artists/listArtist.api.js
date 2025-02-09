const artistService = require('./artist.service');

async function controller(req, res) {
  const artistList = await artistService.listArtist();

  if (artistList.length < 0) {
    return res.json({
      success: false,
      message: 'no artist found',
    });
  }

  return res.json({
    success: true,
    data: artistList,
  });
}

module.exports = controller;
