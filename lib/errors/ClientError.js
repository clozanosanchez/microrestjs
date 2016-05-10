'use strict';

module.exports.ClientError = class ClientError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ClientError';
        this.code = 'CLIENT_ERROR';
    }
};
