'use strict';

/**
 * Proxy to interact remotely with the basic authentication service.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

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
        if (checkTypes.not.string(username) || checkTypes.emptyString(username)) {
            reject(new TypeError('The parameter username must be a non-empty string'));
            return;
        }

        if (checkTypes.not.string(password) || checkTypes.emptyString(password)) {
            reject(new TypeError('The parameter password must be a non-empty string'));
            return;
        }

        const RunnableService = require('../../../../services/RunnableService');
        if (checkTypes.not.object(service) || checkTypes.not.instanceStrict(service, RunnableService)) {
            reject(new TypeError('The parameter service must be a RunnableService object'));
            return;
        }

        const callableServiceFactory = require('../../../factories/CallableServiceFactory');
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
