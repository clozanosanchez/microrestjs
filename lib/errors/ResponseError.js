'use strict';

/**
 * Represents a response error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * ResponseError representes a response error.
 *
 * @public
 * @class
 */
module.exports = class ResponseError extends Error {
    /**
     * Constructor of ResponseError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ResponseError';
        this.code = 'RESPONSE_ERROR';
    }
};
