const { ObjectId } = require('mongodb');

const database = require('../service/database.service');
const config = require('../config');

async function insertSong(songDetails) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .insertOne(songDetails);
}

async function searchSongByName(songName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .find({ songName: { $regex: new RegExp(`\\b${songName}\\b`, 'i') } })
    .toArray();
}

async function findOneSongByName(songName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .findOne(songName);
}

async function findSongsByArtistName(artistName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .find({ artistName })
    .toArray();
}

async function findMostRecentlySongs(limit) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .find()
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
}

async function findSongsByGenreName(genreName) {
  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .find({ genres: genreName })
    .toArray();
}

async function findoneSongById(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  return database
    .getCollectionName(config.COLLECTION_NAME_SONGS)
    .findOne({ _id: new ObjectId(id) });
}

module.exports = {
  insertSong,
  findOneSongByName,
  findSongsByArtistName,
  findoneSongById,
  findSongsByGenreName,
  findMostRecentlySongs,
  searchSongByName,
};
