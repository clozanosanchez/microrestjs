'use strict';

/**
 * Provides functions for basic authorizations.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');
var basicAuthParser = require('basic-auth-parser');
var logger = require('winston').loggers.get('BasicAuthorizationCaller');

var basicAuthenticationServiceProxy = require('./BasicAuthenticationServiceProxy');
var basicAuthorizationServiceProxy = require('./BasicAuthorizationServiceProxy');

/**
 * Gets the function that authorize the execution of the operation though basic authorization.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} service - Service to be authorized.
 * @param {String} operation - Operation to be authorized.
 * @returns {Function} - Function that authorizes the execution of the operation.
 */
module.exports.getAuthorizationCall = function gatAuthorizationCall(service, operation) {
    return function _authorizorizationCall(expressRequest, expressResponse, next) {
        var authorizationHeader = expressRequest.get('Authorization');

        if (checkTypes.not.string(authorizationHeader) || checkTypes.not.unemptyString(authorizationHeader)) {
            expressResponse.set('WWW-Authenticate', 'Basic realm="' + service.getIdentificationName() + '/' + operation + '"');
            expressResponse.sendStatus(401);
            return;
        }

        var authorizationObject = basicAuthParser(authorizationHeader);
        if (checkTypes.not.object(authorizationObject) || checkTypes.emptyObject(authorizationObject) ||
            checkTypes.not.string(authorizationObject.scheme) || authorizationObject.scheme !== 'Basic' ||
            checkTypes.not.string(authorizationObject.username) || checkTypes.not.string(authorizationObject.password)) {
            expressResponse.set('WWW-Authenticate', 'Basic realm="' + service.getIdentificationName() + '/' + operation + '"');
            expressResponse.sendStatus(401);
            return;
        }

        basicAuthenticationServiceProxy.authenticate(authorizationObject.username, authorizationObject.password, service, function _authenticationCallback(authenticationError, authenticationResponse) {
            if (checkTypes.assigned(authenticationError)) {
                var authenticationErrorMessage = 'The authentication failed because -> ' + authenticationError.message;
                logger.warn(authenticationErrorMessage);

                expressResponse.status(500);
                expressResponse.send('SERVER ERROR: ' + authenticationErrorMessage);
                return;
            }

            if (authenticationResponse.getStatus() !== 201) {
                expressResponse.set('WWW-Authenticate', 'Basic realm="' + service.getIdentificationName() + '/' + operation + '"');
                expressResponse.sendStatus(401);
                return;
            }

            var userId = authenticationResponse.getBody().userId;
            if (checkTypes.not.string(userId) || checkTypes.not.unemptyString(userId)) {
                expressResponse.set('WWW-Authenticate', 'Basic realm="' + service.getIdentificationName() + '/' + operation + '"');
                expressResponse.sendStatus(401);
                return;
            }

            basicAuthorizationServiceProxy.authorize(userId, service, operation, function _authorizationCallback(authorizationError, authorizationResponse) {
                if (checkTypes.assigned(authorizationError)) {
                    var authorizationErrorMessage = 'The authorization failed because ->' + authorizationError.message;
                    logger.warn(authorizationErrorMessage);

                    expressResponse.status(500);
                    expressResponse.send('SERVER ERROR: ' + authorizationErrorMessage);
                    return;
                }

                if (authorizationResponse.getStatus() !== 204) {
                    expressResponse.sendStatus(403);
                    return;
                }

                expressRequest.credentials = authorizationObject;
                expressRequest.authorizedUser = userId;

                next();
            });
        });
    };
};
