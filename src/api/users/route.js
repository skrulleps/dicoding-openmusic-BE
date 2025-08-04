const route = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  }
];

module.exports = route;