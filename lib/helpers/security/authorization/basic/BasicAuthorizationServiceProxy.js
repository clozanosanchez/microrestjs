'use strict';

/**
 * Proxy to interact remotely with the basic authorization service.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

const callableServiceFactory = require('../../../factories/CallableServiceFactory');

/**
 * Authorize a user to execute an operation through the basic authorization service.
 *
 * @public
 * @static
 * @function
 * @param {String} userId - Id of the user that has been authenticated and requires the authorization.
 * @param {RunnableService} service - RunnableService that requires the authorization.
 * @param {String} operation - Name of the operation to be authorized.
 * @return {Promise} - Promise that resolves with the response from the basic authorization service and rejects if an error occurs.
 */
module.exports.authorize = function authorize(userId, service, operation) {
    return new Promise((resolve, reject) => { 
        if (checkTypes.not.string(userId) || checkTypes.not.unemptyString(userId)) {
            reject(new TypeError('The parameter userId must be a non-empty string'));
            return;
        }

        if (checkTypes.not.object(service) || checkTypes.emptyObject(service)) {
            //TODO: Improve condition
            reject(new TypeError('The parameter service must be a valid RunnableService'));
            return;
        }

        if (checkTypes.not.string(operation) || checkTypes.not.unemptyString(operation)) {
            reject(new TypeError('The parameter operation must be a non-empty string'));
            return;
        }

        const authorizationService = callableServiceFactory.getService('microrestjs-basic-authorization', 1, service.getContext().getLocation());

        const authorizationRequest = {
            operation: 'authorize',
            body: {
                authorization: {
                    userId: userId,
                    service: service.getIdentificationName(),
                    operation: operation
                }
            }
        };

        authorizationService.execute(authorizationRequest).then((authorizationResponse) => {
            resolve(authorizationResponse);
        }).catch((error) => {
            reject(error);
        });
    });
};
