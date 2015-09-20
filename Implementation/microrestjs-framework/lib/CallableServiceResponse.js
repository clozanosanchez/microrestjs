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

var AbstractResponse = require('./AbstractResponse');

/**
 * CallableServiceResponse allows storing data of a HTTPS response that
 * was received from a callable service. In particular:
 *   - Status code (AbstractResponse)
 *   - Cookies (AbstractResponse)
 *   - Body (AbstractResponse)
 *   - Status message
 *
 * @class
 */
function CallableServiceResponse() {
    AbstractResponse.call(this);
    this.statusMessage = undefined;
}

CallableServiceResponse.prototype = Object.create(AbstractResponse.prototype);
CallableServiceResponse.prototype.constructor = CallableServiceResponse;

/**
 * Gets the status message of the response.
 *
 * @public
 * @function
 * @returns {String} - Status message of the response.
 */
CallableServiceResponse.prototype.getStatusMessage = function getStatusMessage() {
    return this.statusMessage;
};

module.exports = CallableServiceResponse;
