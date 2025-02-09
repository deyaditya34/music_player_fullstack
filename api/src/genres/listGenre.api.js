const genreService = require('./genre.service');

async function controller(req, res) {
  const genreList = await genreService.listGenre();

  if (!genreList) {
    return res.json({
      success: false,
      message: 'no genre found',
    });
  }

  return res.json({
    success: true,
    data: genreList,
  });
}

module.exports = controller;
