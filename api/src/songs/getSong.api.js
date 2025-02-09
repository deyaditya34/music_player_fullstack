const fs = require('fs');

const songService = require('./songs.service');

async function controller(req, res) {
  const { id } = req.params;

  const song = await songService.findoneSongById(id);

  if (!song) {
    return res.json({
      success: false,
      message: 'song not found for the id',
    });
  }

  const fileName = song.filePath.slice(
    song.filePath.lastIndexOf('/'),
    song.filePath.length
  );

  return res.redirect(`/songs/static/${fileName}`);
}

module.exports = controller;
