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
 *   - Cookies (AbstractResponse)
 *   - Body (AbstractResponse)
 *   - Filenames
 *
 * @class
 */
function RunnableServiceResponse() {
    AbstractResponse.call(this);
    this.files = [];
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
 * Adds a cookie to the response.
 *
 * @public
 * @function
 * @param {String} cookieName - Name of the cookie.
 * @param {String} cookieValue - Value of the cookie.
 * @param {Object} cookieOptions - Configuration options for the cookie.
 * @returns {RunnableServiceResponse} - The RunnableServiceResponse to facilitate method chaining.
 */
RunnableServiceResponse.prototype.addCookie = function addCookie(cookieName, cookieValue, cookieOptions) {
    this.cookies[cookieName] = {
        value: cookieValue,
        options: cookieOptions
    };
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

/**
 * Adds the filename of a file that should be sent with the response.
 *
 * @public
 * @function
 * @param {String} filename - Filename of the file that should be sent.
 * @returns {RunnableServiceResponse} - The RunnableServiceResponse to facilitate method chaining.
 */
RunnableServiceResponse.prototype.addFile = function addFile(filename) {
    this.files.push(filename);
    return this;
};

/**
 * Gets all the filenames of the files that should be sent with the response.
 *
 * @public
 * @function
 * @returns {Array} - Filenames of the files that should be sent.
 */
RunnableServiceResponse.prototype.getFiles = function getFiles() {
    return this.files;
};

module.exports = RunnableServiceResponse;
