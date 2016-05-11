'use strict';

module.exports = class RetrieveError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'RetrieveError';
        this.code = 'RETRIEVE_ERROR';
    }
};
