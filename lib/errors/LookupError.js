'use strict';

/**
 * Represents a lookup error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * LookupError representes a lookup error.
 *
 * @public
 * @class
 */
module.exports = class LookupError extends Error {
    /**
     * Constructor of LookupError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'LookupError';
        this.code = 'LOOKUP_ERROR';
    }
};
