const ClientError = require("./ClientError");

class InvariantError extends ClientError {
    constructor(messages) {
        super(messages);
        this.name = 'InvariantError';
    }
}

module.exports = InvariantError;
