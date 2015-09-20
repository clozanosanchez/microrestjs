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
 *   - Cookies
 *   - Body
 *
 * @class
 */
function AbstractResponse() {
    this.status = undefined;
    this.cookies = {};
    this.body = {};
}

/**
 * Gets the HTTP status code of the response.
 *
 * @public
 * @function
 * @returns {Integer} - HTTP status code of the response.
 */
AbstractResponse.prototype.getStatus = function getStatus() {
    return this.status;
};

/**
 * Gets the cookies of the response.
 *
 * @public
 * @function
 * @returns {Object} - Cookies of the response.
 */
AbstractResponse.prototype.getCookies = function getCookies() {
    return this.cookies;
};

/**
 * Gets the body of the response.
 *
 * @public
 * @function
 * @returns {Object} - Body of the response.
 */
AbstractResponse.prototype.getBody = function getBody() {
    return this.body;
};

module.exports = AbstractResponse;
