require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/postgres/AlbumServices');
const SongService = require('./services/postgres/SongServices');
const Albums = require('./api/albums/index');
const Songs = require('./api/songs/index');
const SongsValidator = require('./validator/songs/index');
const AlbumValidator = require('./validator/albums/index');
const ClientError = require('./exceptions/ClientError');


const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumService = new AlbumService();
  const songService = new SongService();

  await server.register({
    plugin: Albums,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  await server.register({
    plugin: Songs,
    options: {
      service: songService,
      validator: SongsValidator,
    },
  });

  await server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      console.log('ClientError caught in onPreResponse:', response.message, 'Constructor:', response.constructor.name);
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode).takeover();
    }

    if (response instanceof Error) {
      // Log error untuk debugging
      console.error(response);
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
