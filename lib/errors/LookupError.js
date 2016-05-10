'use strict';

module.exports.LookupError = class LookupError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'LookupError';
        this.code = 'LOOKUP_ERROR';
    }
};
