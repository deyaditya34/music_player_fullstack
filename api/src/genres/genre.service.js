const database = require('../service/database.service');
const config = require('../config');

async function insertGenres(genreNames) {
  return database
    .getCollectionName(config.COLLECTION_NAME_GENRES)
    .insertMany(genreNames);
}

async function findOneGenre(genreName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_GENRES)
    .findOne(genreName);
}

async function listGenre() {
  return database
    .getCollectionName(config.COLLECTION_NAME_GENRES)
    .find()
    .sort({ genreName: 1 })
    .toArray();
}

module.exports = {
  insertGenres,
  findOneGenre,
  listGenre,
};
