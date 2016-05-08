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

const checkTypes = require('check-types');

const callableServiceFactory = require('../../../factories/CallableServiceFactory');

const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

/**
 * Authenticate the user credentials through the basic authentication service.
 *
 * @public
 * @static
 * @function
 * @param {String} username - Username to be authenticated.
 * @param {String} password - Password to be authenticated.
 * @param {RunnableService} service - RunnableService that requires the authentication.
 * @return {Promise} - Promise that resolves with the response from the basic authentication service and rejects if an error occurs.
 */
module.exports.authenticate = function authenticate(username, password, service) {
    return new Promise((resolve, reject) => {
        if (checkTypes.not.string(username) || checkTypes.not.unemptyString(username)) {
            const authenticationError1 = new Error('The parameter username must be a non-empty string');
            authenticationError1.code = AUTHENTICATION_ERROR;
            reject(authenticationError1);
            return;
        }

        if (checkTypes.not.string(password) || checkTypes.not.unemptyString(password)) {
            const authenticationError2 = new Error('The parameter password must be a non-empty string');
            authenticationError2.code = AUTHENTICATION_ERROR;
            reject(authenticationError2);
            return;
        }

        if (checkTypes.not.object(service) || checkTypes.emptyObject(service)) {
            const authenticationError3 = new Error('The parameter service must be a valid RunnableService');
            authenticationError3.code = AUTHENTICATION_ERROR;
            reject(authenticationError3);
            return;
        }

        const authenticationService = callableServiceFactory.getService('microrestjs-basic-authentication', 1, service.getContext().getLocation());

        const authenticationRequest = {
            operation: 'authenticate',
            body: {
                credentials: {
                    username: username,
                    password: password
                }
            }
        };

        authenticationService.execute(authenticationRequest).then((authenticationResponse) => {
            resolve(authenticationResponse);
        }).catch((error) => {
            reject(error);
        });
    });
};
