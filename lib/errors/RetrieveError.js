'use strict';

module.exports.RetrieveError = class RetrieveError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'RetrieveError';
        this.code = 'RETRIEVE_ERROR';
    }
};
