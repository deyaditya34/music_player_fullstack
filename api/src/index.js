const express = require('express');
const cors = require('cors');

const config = require('./config');
const database = require('./service/database.service');

const notFoundHandler = require('./api-utils/notFoundHandler');
const errorHandler = require('./api-utils/errorHandler');

const songsRouter = require('./songs/songs.router.api');
const artistRouter = require('./artists/artist.router.api');
const genreRouter = require('./genres/genre.router.api');

async function start() {
  console.log('Initializing database...');
  await database.Initialize();
  console.log('Database Initialized. Starting server...');

  const server = new express();
  console.log('Server started...');

  server.use(cors({
    origin: "http://localhost:8090",
    credentials: true
  }));
  server.use(express.json());
  server.use(express.urlencoded({extended: true}))

  server.use('/songs', songsRouter);
  server.use('/artists', artistRouter);
  server.use('/genres', genreRouter);
  server.use('/', express.static('frontend'));

  server.use(notFoundHandler);
  server.use(errorHandler);

  server.listen(config.HTTP_PORT, () => {
    console.log(`server is listening on port - ${config.HTTP_PORT}`);
  });
}

start().catch((err) => {
  console.log(err);
});
