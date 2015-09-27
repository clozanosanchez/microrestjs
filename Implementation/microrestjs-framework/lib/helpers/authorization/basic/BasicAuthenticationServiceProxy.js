'use strict';

/**
 * Proxy to interact remotely with the basic authentication service.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var callableServiceFactory = require('../../../CallableServiceFactory');

var AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

/**
 * Authenticate the user credentials through the basic authentication service.
 *
 * @public
 * @static
 * @function
 * @param {String} username - Username to be authenticated.
 * @param {String} password - Password to be authenticated.
 * @param {RunnableService} service - RunnableService that requires the authentication.
 * @param {authenticateCallback} authenticateCallback - Callback for delegating the response from authenticate operation.
 * @throws an Error if the authenticateCallback parameter is not a valid callback function.
 */
module.exports.authenticate = function authenticate(username, password, service, authenticateCallback) {
    if (checkTypes.not.function(authenticateCallback)) {
        throw new Error('The parameter authenticateCallback must be a defined function');
    }

    if (checkTypes.not.string(username) || checkTypes.not.unemptyString(username)) {
        var authenticationError1 = new Error('The parameter username must be a non-empty string');
        authenticationError1.code = AUTHENTICATION_ERROR;
        authenticateCallback(authenticationError1);
        return;
    }

    if (checkTypes.not.string(password) || checkTypes.not.unemptyString(password)) {
        var authenticationError2 = new Error('The parameter password must be a non-empty string');
        authenticationError2.code = AUTHENTICATION_ERROR;
        authenticateCallback(authenticationError2);
        return;
    }

    if (checkTypes.not.object(service) || checkTypes.emptyObject(service)) {
        var authenticationError3 = new Error('The parameter service must be a valid RunnableService');
        authenticationError3.code = AUTHENTICATION_ERROR;
        authenticateCallback(authenticationError3);
        return;
    }

    var authenticationService = callableServiceFactory.getService('microrestjs-basic-authentication', 1, service.getContext().getLocation());

    var authenticationRequest = {
        operation: 'authenticate',
        body: {
            credentials: {
                username: username,
                password: password
            }
        }
    };

    authenticationService.execute(authenticationRequest, authenticateCallback);
};

/**
 * Callback declaration for delegating the responses received from basic authentication service.
 *
 * @callback authenticateCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {Object} response - Represents the received response from the basic authentication service.
 */
