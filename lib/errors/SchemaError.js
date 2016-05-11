'use strict';

module.exports = class SchemaError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'SchemaError';
        this.code = 'SCHEMA_ERROR';
    }
};