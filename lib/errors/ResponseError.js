'use strict';

module.exports.ResponseError = class ResponseError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ResponseError';
        this.code = 'RESPONSE_ERROR';
    }
};
