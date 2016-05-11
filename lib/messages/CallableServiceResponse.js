'use strict';

/**
 * Creates CallableServiceResponses to store the data that
 * has been received from CallableServices.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const AbstractResponse = require('./AbstractResponse');

/**
 * CallableServiceResponse allows storing data of a HTTPS response that
 * was received from a callable service. In particular:
 *   - Status code (AbstractResponse)
 *   - Body (AbstractResponse)
 *   - Status message
 *
 * @public
 * @class
 */
module.exports = class CallableServiceResponse extends AbstractResponse {
    /**
     * Constructor of CallableServiceResponse.
     *
     * @public
     * @constructor
     */
    constructor() {
        super();
        this.headers = {};
        this.statusMessage = undefined;
    }

    /**
     * Gets all the headers of the response.
     *
     * @public
     * @function
     * @returns {Object} - All the headers of the response.
     */
    getHeaders() {
        return this.headers;
    }

    /**
     * Gets the value of a specific header of the response.
     *
     * @public
     * @function
     * @param {String} headerName - The name of the header to be retrieved.
     * @returns {String|Undefined} - The value of the header, if exists; undefined, otherwise.
     */
    getHeader(headerName) {
        switch (headerName.toLowerCase()) {
            case 'referer':
            case 'referrer':
                return this.headers.referrer || this.headers.referer;
            default:
                return this.headers[headerName.toLowerCase()];
        }
    }

    /**
     * Gets the status message of the response.
     *
     * @public
     * @function
     * @returns {String} - Status message of the response.
     */
    getStatusMessage() {
        return this.statusMessage;
    }
};
