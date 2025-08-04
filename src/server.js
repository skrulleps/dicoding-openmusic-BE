require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// album
const AlbumService = require('./services/postgres/AlbumServices');
const Albums = require('./api/albums/index');
const AlbumValidator = require('./validator/albums/index');
// songs
const SongService = require('./services/postgres/SongServices');
const Songs = require('./api/songs/index');
const SongsValidator = require('./validator/songs/index');
// users
const UserServices = require('./services/postgres/UserServices');
const Users = require('./api/users/index');
const UserValidator = require('./validator/users/index');
// authentications
const AuthenticationsService = require('./services/postgres/AuthenticationServices');
const Authentications = require('./api/authentications/index');
const AuthenticationsValidator = require('./validator/authentications/index');
const tokenManager = require('./tokenize/TokenManager');

// error handling
const ClientError = require('./exceptions/ClientError');


const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserServices();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register plugins
  await server.register([
    {
      plugin: Jwt
    }
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: Albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: Songs,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
    {
      plugin: Users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: Authentications,
      options: {
        authenticationsService,
        usersService: userService,
        validator: AuthenticationsValidator,
        tokenManager,
      },
    }
  ]);


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
