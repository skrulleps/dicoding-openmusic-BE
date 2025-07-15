class ClientError extends Error {
    constructor(messages, statusCode = 400) {
        super(messages);
        this.name = 'ClientError';
        this.statusCode = statusCode;
    }
}

module.exports = ClientError;
