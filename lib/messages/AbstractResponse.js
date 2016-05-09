'use strict';

/**
 * Creates abstract responses to store general
 * data of HTTPS responses.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * AbstractResponse allows storing data of a HTTPS response.
 * In particular:
 *   - Status code
 *   - Body
 *
 * @public
 * @class
 */
module.exports.AbstractResponse = class AbstractResponse {
    /**
     * Constructor of AbstractResponse.
     *
     * @public
     * @constructor
     */
    constructor() {
        this.status = undefined;
        this.body = {};
    }

    /**
     * Gets the HTTP status code of the response.
     *
     * @public
     * @function
     * @returns {Integer} - HTTP status code of the response.
     */
    getStatus() {
        return this.status;
    }

    /**
     * Gets the body of the response.
     *
     * @public
     * @function
     * @returns {Object} - Body of the response.
     */
    getBody() {
        return this.body;
    }
};
