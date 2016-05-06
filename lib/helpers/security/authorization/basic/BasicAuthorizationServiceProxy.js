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

var checkTypes = require('check-types');

var callableServiceFactory = require('../../../factories/CallableServiceFactory');

var AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR';

/**
 * Authorize a user to execute an operation through the basic authorization service.
 *
 * @public
 * @static
 * @function
 * @param {String} userId - Id of the user that has been authenticated and requires the authorization.
 * @param {RunnableService} service - RunnableService that requires the authorization.
 * @param {String} operation - Name of the operation to be authorized.
 * @param {authorizeCallback} authorizeCallback - Callback for delegating the response from authorize operation.
 * @throws an Error if the authorizeCallback parameter is not a valid callback function.
 */
module.exports.authorize = function authorize(userId, service, operation, authorizeCallback) {
    if (checkTypes.not.function(authorizeCallback)) {
        throw new Error('The parameter authorizeCallback must be a defined function');
    }

    if (checkTypes.not.string(userId) || checkTypes.not.unemptyString(userId)) {
        var authorizationError1 = new Error('The parameter userId must be a non-empty string');
        authorizationError1.code = AUTHORIZATION_ERROR;
        authorizeCallback(authorizationError1);
        return;
    }

    if (checkTypes.not.object(service) || checkTypes.emptyObject(service)) {
        var authorizationError2 = new Error('The parameter service must be a valid RunnableService');
        authorizationError2.code = AUTHORIZATION_ERROR;
        authorizeCallback(authorizationError2);
        return;
    }

    if (checkTypes.not.string(operation) || checkTypes.not.unemptyString(operation)) {
        var authorizationError3 = new Error('The parameter operation must be a non-empty string');
        authorizationError3.code = AUTHORIZATION_ERROR;
        authorizeCallback(authorizationError3);
        return;
    }

    var authorizationService = callableServiceFactory.getService('microrestjs-basic-authorization', 1, service.getContext().getLocation());

    var authorizationRequest = {
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
        authorizeCallback(null, authorizationResponse);
    }).catch((error) => {
        authorizeCallback(error);
    });
};

/**
 * Callback declaration for delegating the responses received from basic authorization service.
 *
 * @callback authorizationCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {Object} response - Represents the received response from the basic authorization service.
 */
