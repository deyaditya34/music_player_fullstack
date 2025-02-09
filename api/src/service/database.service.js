const mongodb = require('mongodb');

const config = require('../config');

const mongoClient = new mongodb.MongoClient(config.MONGO_URI);

let database = null;

async function Initialize() {
  await mongoClient.connect();

  database = mongoClient.db(config.DATABASE_NAME);
}

function getCollectionName(collectionName) {
  return database.collection(collectionName);
}

module.exports = {
  Initialize,
  getCollectionName,
};
