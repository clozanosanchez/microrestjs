'use strict';

/**
 * Manages the authorization of the services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

/**
 * Gets the function that authorizes the execution of a service operation.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} service - RunnableService to get its authorization function.
 * @param {String} operation - Name of operation to get its authorization function.
 * @returns {Function} - Function to authorize the execution of the operation.
 */
module.exports.getAuthorizationCall = function getAuthorizationCall(service, operation) {
    const security = service.getContext().getSecurity(operation);
    if (checkTypes.not.object(security) || checkTypes.emptyObject(security)) {
        return _withoutAuthorizationCall;
    }

    const authorizationCall = _getAuthorizationCall(security, service, operation);
    return authorizationCall;
};

/**
 * Gets the correct function to authorize the execution of a service operation.
 *
 * @private
 * @function
 * @param {Object} security - Security that has to be satisfied during authorization.
 * @param {RunnableService} service - RunnableService to get its authorization function.
 * @param {String} operation - Name of the operation to get its authorization function.
 * @returns {Function} - Function to authorize the execution of the operation.
 */
function _getAuthorizationCall(security, service, operation) {
    if (security.scheme === 'basic') {
        const basicAuthorizationCaller = require('./basic/BasicAuthorizationCaller');
        return basicAuthorizationCaller.getAuthorizationCall(service, operation);
    }

    return _withoutAuthorizationCall;
}

/**
 * Function that skips the authorization because it is not necessary.
 * In other words, this function authorizes always.
 *
 * @private
 * @function
 */
function _withoutAuthorizationCall(request, response, next) {
    next();
}

