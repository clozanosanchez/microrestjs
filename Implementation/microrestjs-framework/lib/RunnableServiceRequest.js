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

/**
 * RunnableServiceRequest allows storing the data that has been
 * received from a client to execute a service operation.
 * In particular:
 *   - Headers
 *   - Path parameters
 *   - Query parameters
 *   - The hostname of the request
 *   - The subdomains of the request
 *   - The original url of the request
 *   - Remote IP Address of the request
 *   - Remote IP Addresses specified in X-Forwarded-For header
 *   - XHR = XMLHttpRequest request
 *   - Body
 *   - Credentials
 *   - Authorized user
 *
 * @class
 */
function RunnableServiceRequest() {
    this.headers = {};
    this.pathParameters = {};
    this.queryParameters = {};
    this.hostname = '';
    this.subdomains = [];
    this.originalUrl = '';
    this.ip = '';
    this.ips = [];
    this.xhr = undefined;
    this.body = {};
    this.credentials = {};
    this.authorizedUser = '';
}

/**
 * Gets all the headers of the request.
 *
 * @public
 * @function
 * @returns {Object} - All the headers of the request.
 */
RunnableServiceRequest.prototype.getHeaders = function getHeaders() {
    return this.headers;
};

/**
 * Gets the value of a specific header of the request.
 *
 * @public
 * @function
 * @param {String} headerName - The name of the header to be retrieved.
 * @returns {String|Undefined} - The value of the header, if exists; undefined, otherwise.
 */
RunnableServiceRequest.prototype.getHeader = function getHeader(headerName) {
    switch (headerName.toLowerCase()) {
        case 'referer':
        case 'referrer':
            return this.headers.referrer || this.headers.referer;
        default:
            return this.headers[headerName.toLowerCase()];
    }
};

/**
 * Gets all the parameters of the request.
 *
 * @public
 * @function
 * @returns {Object} - All the parameters of the request.
 */
RunnableServiceRequest.prototype.getParameters = function getParameters() {
    var parameters = {};

    var pathParametersNames = Object.keys(this.pathParameters);
    for (var i = 0; i < pathParametersNames.length; i++) {
        var pathParameter = pathParametersNames[i];
        parameters[pathParameter] = this.pathParameters[pathParameter];
    }

    var queryParametersNames = Object.keys(this.queryParameters);
    for (var j = 0; j < queryParametersNames.length; j++) {
        var queryParameter = queryParametersNames[j];
        parameters[queryParameter] = this.queryParameters[queryParameter];
    }

    return parameters;
};

/**
 * Gets the value of a specific parameter if was included in the request.
 *
 * @public
 * @function
 * @param {String} parameterName - The name of the parameter to be retrieved.
 * @returns {String|Undefined} - The value of the parameter, if exists; undefined, otherwise.
 */
RunnableServiceRequest.prototype.getParameter = function getParameter(parameterName) {
    return this.pathParameters[parameterName] || this.queryParameters[parameterName];
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
 * @returns {String|Undefined} - The value of the path parameter, if exists; undefined, otherwise.
 */
RunnableServiceRequest.prototype.getPathParameter = function getPathParameter(parameterName) {
    return this.pathParameters[parameterName];
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
 * @returns {String|Undefined} - The value of the query parameter, if exists; undefined, otherwise.
 */
RunnableServiceRequest.prototype.getQueryParameter = function getQueryParameter(parameterName) {
    return this.queryParameters[parameterName];
};

/**
 * Gets the hostname of the request.
 *
 * @public
 * @function
 * @returns {String} - The hostname of the request.
 */
RunnableServiceRequest.prototype.getHostname = function getHostname() {
    return this.hostname;
};

/**
 * Gets the subdomains of the request.
 *
 * @public
 * @function
 * @returns {String[]} - The subdomains of the request.
 */
RunnableServiceRequest.prototype.getSubdomains = function getSubdomains() {
    return this.subdomains;
};

/**
 * Gets the original URL of the request.
 *
 * @public
 * @function
 * @returns {String} - The original URL of the request.
 */
RunnableServiceRequest.prototype.getOriginalUrl = function getOriginalUrl() {
    return this.originalUrl;
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

/**
 * Gets the remote IP addresses of the request specified in X-Forwarded-For header.
 *
 * @public
 * @function
 * @returns {String[]} - The remote IP addresses of the request.
 */
RunnableServiceRequest.prototype.getIps = function getIps() {
    return this.ips;
};

/**
 * Gets whether the request has been sent using XMLHttpRequest.
 *
 * @public
 * @function
 * @returns {Boolean} - true, if the request’s “X-Requested-With” header field is “XMLHttpRequest”; false, otherwise.
 */
RunnableServiceRequest.prototype.getXhr = function getXhr() {
    return this.xhr;
};

/**
 * Gets the body of the request.
 *
 * @public
 * @function
 * @returns {Object|String} - The body of the request.
 */
RunnableServiceRequest.prototype.getBody = function getBody() {
    return this.body;
};

/**
 * Gets the credentials of the user.
 *
 * @public
 * @function
 * @returns {Object} - The user credentials.
 */
RunnableServiceRequest.prototype.getCredentials = function getCredentials() {
    return this.credentials;
};

/**
 * Gets the authorized user.
 *
 * @public
 * @function
 * @returns {String} - The authorized user.
 */
RunnableServiceRequest.prototype.getAuthorizedUser = function getAuthorizedUser() {
    return this.authorizedUser;
};

module.exports = RunnableServiceRequest;
