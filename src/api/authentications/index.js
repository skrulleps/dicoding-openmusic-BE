const AuthenticationHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authenticationsService, usersService, validator, tokenManager }) => {
    const authenticationHandler = new AuthenticationHandler(authenticationsService, usersService, validator, tokenManager);
    server.route(routes(authenticationHandler));
  },
};
