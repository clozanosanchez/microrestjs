'use strict';

/**
 * Represents a schema error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * SchemaError representes a schema error.
 *
 * @public
 * @class
 */
module.exports = class SchemaError extends Error {
    /**
     * Constructor of SchemaError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'SchemaError';
        this.code = 'SCHEMA_ERROR';
    }
};
