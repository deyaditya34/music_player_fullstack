require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  HTTP_PORT: process.env.HTTP_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  COLLECTION_NAME_SONGS: process.env.COLLECTION_NAME_SONGS,
  COLLECTION_NAME_ARTISTS: process.env.COLLECTION_NAME_ARTISTS,
  COLLECTION_NAME_GENRES: process.env.COLLECTION_NAME_GENRES,
};
