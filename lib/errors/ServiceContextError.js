'use strict';

module.exports = class ServiceContextError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ServiceContextError';
        this.code = 'SERVICE_CONTEXT_ERROR';
    }
};
