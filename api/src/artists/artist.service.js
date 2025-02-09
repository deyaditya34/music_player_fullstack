const database = require('../service/database.service');
const config = require('../config');

async function insertArtist(artistName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_ARTISTS)
    .insertOne(artistName);
}

async function findOneArist(artistName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_ARTISTS)
    .findOne(artistName);
}

async function listArtist() {
  return database
    .getCollectionName(config.COLLECTION_NAME_ARTISTS)
    .find()
    .sort({ artistName: 1 })
    .toArray();
}

module.exports = {
  insertArtist,
  findOneArist,
  listArtist,
};
