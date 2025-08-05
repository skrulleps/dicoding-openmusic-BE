const CollaborationsHandler = require('./handler');
const CollaborationsRoutes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { collaborationService, playlistService, validator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationService,
      playlistService,
      validator
    );

    server.plugins.collaborationsHandler = collaborationsHandler;
    server.route(CollaborationsRoutes);
  },
};
