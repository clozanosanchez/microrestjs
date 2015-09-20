'use strict';

/**
 * Creates RunnableServiceRequests to store the data that has been
 * received from a client to execute a service operation.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

/**
 * RunnableServiceRequest allows storing the data that has been
 * received from a client to execute a service operation.
 * In particular:
 *   - Cookies
 *   - Path parameters
 *   - Query parameters
 *   - Body
 *   - Remote IP Address
 *
 * @class
 */
function RunnableServiceRequest() {
    this.cookies = {};
    this.pathParameters = {};
    this.queryParameters = {};
    this.body = {};
    this.ip = undefined;
}

/**
 * Gets all the cookies of the request.
 *
 * @public
 * @function
 * @returns {Object} - All the cookies of the request.
 */
RunnableServiceRequest.prototype.getCookies = function getCookies() {
    return this.cookies;
};

/**
 * Gets the value of a specific cookie if was included in the request.
 *
 * @public
 * @function
 * @param {String} cookieName - The name of the cookie to be retrieved.
 * @returns {String|Null} - The value of the cookie, if exists; null, otherwise.
 */
RunnableServiceRequest.prototype.getCookie = function getCookie(cookieName) {
    var cookieValue = this.cookies[cookieName];
    if (checkTypes.not.assigned(cookieValue)) {
        return null;
    }

    return cookieValue;
};

/**
 * Gets all the path parameters of the request.
 *
 * @public
 * @function
 * @returns {Object} - All the path parameters of the request.
 */
RunnableServiceRequest.prototype.getPathParameters = function getPathParameters() {
    return this.pathParameters;
};

/**
 * Gets the value of a specific path parameter if was included in the request.
 *
 * @public
 * @function
 * @param {String} parameterName - The name of the path parameter to be retrieved.
 * @returns {String|Null} - The value of the path parameter, if exists; null, otherwise.
 */
RunnableServiceRequest.prototype.getPathParameter = function getPathParameter(parameterName) {
    var parameterValue = this.pathParameters[parameterName];
    if (checkTypes.not.assigned(parameterValue)) {
        return null;
    }

    return parameterValue;
};

/**
 * Gets all the query parameters of the request.
 *
 * @public
 * @function
 * @returns {Object} - All the query parameters of the request.
 */
RunnableServiceRequest.prototype.getQueryParameters = function getQueryParameters() {
    return this.queryParameters;
};

/**
 * Gets the value of a specific query parameter if was included in the request.
 *
 * @public
 * @function
 * @param {String} parameterName - The name of the query parameter to be retrieved.
 * @returns {String|Null} - The value of the query parameter, if exists; null, otherwise.
 */
RunnableServiceRequest.prototype.getQueryParameter = function getQueryParameter(parameterName) {
    var parameterValue = this.queryParameters[parameterName];
    if (checkTypes.not.assigned(parameterValue)) {
        return null;
    }

    return parameterValue;
};

/**
 * Gets the body of the request.
 *
 * @public
 * @function
 * @returns {Object} - The body of the request.
 */
RunnableServiceRequest.prototype.getBody = function getBody() {
    return this.body;
};

/**
 * Gets the remote IP address of the request.
 *
 * @public
 * @function
 * @returns {String} - The remote IP address of the request.
 */
RunnableServiceRequest.prototype.getIp = function getIp() {
    return this.ip;
};

module.exports = RunnableServiceRequest;
