'use strict';

/**
 * Represents a retrieve error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * RetrieveError representes a retrieve error.
 *
 * @public
 * @class
 */
module.exports = class RetrieveError extends Error {
    /**
     * Constructor of RetrieveError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'RetrieveError';
        this.code = 'RETRIEVE_ERROR';
    }
};
