const routes = [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => {
      const { collaborationsHandler } = request.server.plugins;
      return collaborationsHandler.postCollaborationHandler(request, h);
    },
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => {
      const { collaborationsHandler } = request.server.plugins;
      return collaborationsHandler.deleteCollaborationHandler(request, h);
    },
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
