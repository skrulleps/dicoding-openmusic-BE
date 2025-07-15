const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
    constructor(messages) {
        super(messages, 404);
        this.name = 'NotFoundError';
    }
}

module.exports = NotFoundError;
