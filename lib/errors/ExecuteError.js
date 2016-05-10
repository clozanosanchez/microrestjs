'use strict';

module.exports.ExecuteError = class ExecuteError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ExecuteError';
        this.code = 'EXECUTE_ERROR';
    }
};
