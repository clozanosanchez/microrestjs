'use strict';

/**
 * Represents a client error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * ClientError represents a client error.
 *
 * @public
 * @class
 */
module.exports = class ClientError extends Error {
    /**
     * Constructor of ClientError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ClientError';
        this.code = 'CLIENT_ERROR';
    }
};
