'use strict';

/**
 * Creates RunnableServiceResponses to store the data that
 * must be sent as response of executing service operations.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var AbstractResponse = require('./AbstractResponse');

/**
 * RunnableServiceResponse allows storing the data that must be
 * sent as a response of executing a service operation.
 * In particular:
 *   - Status code (AbstractResponse)
 *   - Body (AbstractResponse)
 *
 * @class
 */
function RunnableServiceResponse() {
    AbstractResponse.call(this);
}

RunnableServiceResponse.prototype = Object.create(AbstractResponse.prototype);
RunnableServiceResponse.prototype.constructor = RunnableServiceResponse;

/**
 * Sets the status code of the response.
 *
 * @public
 * @function
 * @param {Integer} status - Status code of the response.
 * @returns {RunnableServiceResponse} - The RunnableServiceResponse to facilitate method chaining.
 */
RunnableServiceResponse.prototype.setStatus = function setStatus(status) {
    this.status = status;
    return this;
};

/**
 * Sets the body of the response.
 *
 * @public
 * @function
 * @param {String|Object} body - Body of the response.
 * @returns {RunnableServiceResponse} - The RunnableServiceResponse to facilitate method chaining.
 */
RunnableServiceResponse.prototype.setBody = function setBody(body) {
    this.body = body;
    return this;
};

module.exports = RunnableServiceResponse;
