'use strict';

/**
 * Represents a service context error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * ServiceContextError representes a service context error.
 *
 * @public
 * @class
 */
module.exports = class ServiceContextError extends Error {
    /**
     * Constructor of ServiceContextError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ServiceContextError';
        this.code = 'SERVICE_CONTEXT_ERROR';
    }
};
