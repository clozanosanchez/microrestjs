'use strict';

module.exports = class ExecuteError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ExecuteError';
        this.code = 'EXECUTE_ERROR';
    }
};
