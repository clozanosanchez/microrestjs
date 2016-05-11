'use strict';

/**
 * Represents an execute error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * ExecuteError representes an execute error.
 *
 * @public
 * @class
 */
module.exports = class ExecuteError extends Error {
    /**
     * Constructor of ExecuteError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ExecuteError';
        this.code = 'EXECUTE_ERROR';
    }
};
