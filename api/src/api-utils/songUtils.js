const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

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

function genreFormatter(genres = []) {
  let result = [];

  genres.forEach((genre) => {
    result.push({ genreName: genre });
  });

  return result;
}

module.exports = {
  getDurationFromBuffer,
  genreFormatter,
};
