const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(messages) {
    super(messages, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;